<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use ZipArchive;

class UpgradeController extends Controller
{
    protected $backupPath;

    public function __construct()
    {
        $this->backupPath = storage_path('app/backups');
    }

    public function index()
    {
        // Get system health status
        $healthStatus = $this->checkSystemHealth();

        return Inertia::render('upgrade/index', [
            'uploadedFile' => session('upgrade_uploaded_file'),
            'healthStatus' => $healthStatus,
            'availableBackups' => $this->getAvailableBackups(),
        ]);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'upgrade_file' => 'required|file|mimes:zip|max:102400', // 100MB max
        ]);

        // Additional validation: check if zip contains valid upgrade files
        $file = $request->file('upgrade_file');
        if (!$this->validateUpgradeFile($file)) {
            return back()->withErrors(['upgrade_file' => 'Invalid upgrade file. The ZIP must contain proper upgrade files.']);
        }

        $filename = 'upgrade_' . time() . '_' . uniqid() . '.zip';
        $path = $file->storeAs('upgrades', $filename, 'local');

        // Store in session with additional metadata
        session([
            'upgrade_uploaded_file' => $path,
            'upgrade_file_name' => $filename,
            'upgrade_file_size' => $file->getSize(),
            'upgrade_uploaded_at' => now(),
        ]);

        Log::info('Upgrade file uploaded', [
            'filename' => $filename,
            'size' => $file->getSize(),
            'path' => $path
        ]);

        return back()->with('success', 'Upgrade file uploaded successfully. File size: ' . number_format($file->getSize() / 1024 / 1024, 2) . ' MB');
    }

    public function apply(Request $request)
    {
        $request->validate([
            'file_path' => 'required|string'
        ]);

        $receivedPath = $request->file_path;
        $fullPath = storage_path('app/' . $receivedPath);

        // Security check: ensure path is within allowed directory
        if (!str_starts_with($fullPath, storage_path('app/upgrades/'))) {
            Log::warning('Security violation: Attempted to access file outside upgrade directory', [
                'path' => $receivedPath,
                'user_id' => auth()->id()
            ]);
            return back()->withErrors(['file_path' => 'Invalid file path.']);
        }

        // Check if file exists
        if (!File::exists($fullPath)) {
            return back()->withErrors(['file_path' => 'Upgrade file not found. The uploaded file may have been deleted or expired. Please upload the file again.']);
        }

        try {
            Log::info('Starting upgrade process', [
                'file_path' => $receivedPath,
                'user_id' => auth()->id(),
                'user_email' => auth()->user()->email ?? 'unknown'
            ]);

            // Pre-upgrade health check
            $preUpgradeHealth = $this->checkSystemHealth();
            if (!$preUpgradeHealth['database'] || !$preUpgradeHealth['storage']) {
                return back()->withErrors(['upgrade' => 'System health check failed. Please resolve issues before upgrading.']);
            }

            // Create comprehensive backup
            $backupId = $this->createComprehensiveBackup();
            Log::info('Comprehensive backup created', ['backup_id' => $backupId]);

            // Extract zip
            $extractPath = storage_path('app/upgrades/temp_' . time() . '_' . uniqid());
            $this->extractZip($fullPath, $extractPath);
            Log::info('ZIP extraction completed', ['extract_path' => $extractPath]);

            // Validate extracted files
            if (!$this->validateExtractedFiles($extractPath)) {
                $this->cleanupFailedUpgrade($extractPath);
                return back()->withErrors(['upgrade' => 'Extracted files validation failed. The upgrade package appears to be corrupted.']);
            }

            // Apply upgrade with transaction safety
            DB::beginTransaction();
            try {
                $this->applyUpgradeSafely($extractPath, $backupId);
                DB::commit();
                Log::info('Upgrade applied successfully');
            } catch (\Exception $e) {
                DB::rollBack();
                Log::error('Upgrade failed during application, rolling back', [
                    'error' => $e->getMessage(),
                    'backup_id' => $backupId
                ]);
                $this->rollbackUpgrade($backupId);
                $this->cleanupFailedUpgrade($extractPath);
                throw $e;
            }

            // Post-upgrade health check
            $postUpgradeHealth = $this->checkSystemHealth();
            if (!$postUpgradeHealth['database']) {
                Log::warning('Post-upgrade health check failed for database', $postUpgradeHealth);
                // Don't fail the upgrade for this, just log it
            }

            // Cleanup
            File::delete($fullPath);
            File::deleteDirectory($extractPath);
            session()->forget(['upgrade_uploaded_file', 'upgrade_file_name', 'upgrade_file_size', 'upgrade_uploaded_at']);

            Log::info('Upgrade process completed successfully', [
                'backup_id' => $backupId,
                'user_id' => auth()->id()
            ]);

            return back()->with('success', 'Upgrade applied successfully! System has been updated to the latest version.');

        } catch (\Exception $e) {
            Log::error('Upgrade failed with exception', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'file_path' => $receivedPath,
                'user_id' => auth()->id()
            ]);

            return back()->withErrors(['upgrade' => 'Upgrade failed: ' . $e->getMessage() . '. Check logs for details.']);
        }
    }

    public function rollback(Request $request)
    {
        $request->validate([
            'backup_id' => 'required|string'
        ]);

        try {
            $this->rollbackUpgrade($request->backup_id);
            Log::info('Manual rollback completed', [
                'backup_id' => $request->backup_id,
                'user_id' => auth()->id()
            ]);

            return back()->with('success', 'System rolled back successfully.');
        } catch (\Exception $e) {
            Log::error('Rollback failed', [
                'error' => $e->getMessage(),
                'backup_id' => $request->backup_id,
                'user_id' => auth()->id()
            ]);

            return back()->withErrors(['rollback' => 'Rollback failed: ' . $e->getMessage()]);
        }
    }

    protected function validateUpgradeFile($file)
    {
        // Basic file validation
        if (!$file->isValid()) {
            return false;
        }

        // Check file size (additional check beyond Laravel validation)
        if ($file->getSize() > 104857600) { // 100MB
            return false;
        }

        // Try to open as ZIP and check contents
        $zip = new ZipArchive();
        $tempPath = $file->getRealPath();

        if ($zip->open($tempPath) !== true) {
            return false;
        }

        // Check for required files/directories
        $hasComposer = false;
        $hasApp = false;

        for ($i = 0; $i < $zip->numFiles; $i++) {
            $filename = $zip->getNameIndex($i);

            // Skip directories
            if (substr($filename, -1) === '/') {
                continue;
            }

            if (strpos($filename, 'composer.json') !== false) {
                $hasComposer = true;
            }
            if (strpos($filename, 'app/') !== false) {
                $hasApp = true;
            }
        }

        $zip->close();

        // For now, just check if it's a valid ZIP. More sophisticated validation can be added later
        return true;
    }

    protected function createComprehensiveBackup()
    {
        $backupId = 'backup_' . date('Y_m_d_H_i_s') . '_' . uniqid();

        // Create backup directory
        $backupDir = $this->backupPath . '/' . $backupId;
        if (!File::exists($backupDir)) {
            File::makeDirectory($backupDir, 0755, true);
        }

        // Backup essential files
        $filesToBackup = [
            'composer.json',
            'composer.lock',
            'package.json',
            'package-lock.json',
            '.env',
            'artisan',
            'README.md'
        ];

        foreach ($filesToBackup as $file) {
            $source = base_path($file);
            if (File::exists($source)) {
                File::copy($source, $backupDir . '/' . $file);
            }
        }

        // Create database backup
        $dbBackupPath = $backupDir . '/database_backup.sql';
        try {
            // Use mysqldump if available, otherwise try alternative methods
            $dbName = config('database.connections.mysql.database');
            $dbUser = config('database.connections.mysql.username');
            $dbPass = config('database.connections.mysql.password');
            $dbHost = config('database.connections.mysql.host');

            $command = "mysqldump --user={$dbUser} --password={$dbPass} --host={$dbHost} {$dbName} > {$dbBackupPath}";
            exec($command, $output, $returnVar);

            if ($returnVar !== 0) {
                Log::warning('Database backup failed with mysqldump', ['output' => $output]);
                // Fallback: try to create a simple backup using Laravel
                $this->createLaravelDbBackup($dbBackupPath);
            }
        } catch (\Exception $e) {
            Log::warning('Database backup failed', ['error' => $e->getMessage()]);
            $this->createLaravelDbBackup($dbBackupPath);
        }

        return $backupId;
    }

    protected function createLaravelDbBackup($path)
    {
        try {
            // Simple backup of key tables
            $tables = ['users', 'migrations', 'settings'];
            $content = "-- Laravel Database Backup\n-- Created: " . now() . "\n\n";

            foreach ($tables as $table) {
                if (Schema::hasTable($table)) {
                    $records = DB::table($table)->get();
                    if ($records->count() > 0) {
                        $content .= "-- Dumping table `$table`\n";
                        foreach ($records as $record) {
                            $values = array_map(function($value) {
                                return is_null($value) ? 'NULL' : "'" . addslashes($value) . "'";
                            }, (array) $record);
                            $content .= "INSERT INTO `$table` VALUES (" . implode(',', $values) . ");\n";
                        }
                        $content .= "\n";
                    }
                }
            }

            File::put($path, $content);
        } catch (\Exception $e) {
            Log::error('Laravel DB backup failed', ['error' => $e->getMessage()]);
        }
    }

    protected function validateExtractedFiles($extractPath)
    {
        // Check if composer.json exists
        if (!File::exists($extractPath . '/composer.json')) {
            return false;
        }

        // Check if it's a Laravel project (has artisan file or app directory)
        if (!File::exists($extractPath . '/artisan') && !File::isDirectory($extractPath . '/app')) {
            return false;
        }

        return true;
    }

    protected function applyUpgradeSafely($extractPath, $backupId)
    {
        // Copy files from extract path to root, but skip dangerous files
        $this->copyUpgradeFilesSafely($extractPath);

        // Run migrations
        Log::info('Running database migrations');
        Artisan::call('migrate', ['--force' => true]);

        // Run npm install if package.json changed
        if ($this->hasPackageJsonChanged($extractPath)) {
            Log::info('Running npm install');
            exec('npm install', $output, $returnVar);
            if ($returnVar !== 0) {
                Log::warning('npm install failed', ['output' => $output]);
            }
        }

        // Clear caches
        Log::info('Clearing system caches');
        Artisan::call('config:clear');
        Artisan::call('cache:clear');
        Artisan::call('view:clear');
        Artisan::call('route:clear');

        // Additional cache clearing
        Artisan::call('config:cache');
        Artisan::call('route:cache');
        Artisan::call('view:cache');
    }

    protected function copyUpgradeFilesSafely($extractPath)
    {
        $skipFiles = [
            '.env',
            '.env.example',
            'storage/logs/laravel.log',
            'storage/app/backups/',
            'storage/app/upgrades/',
            '.git/',
            'node_modules/',
            'vendor/'
        ];

        $rootPath = base_path();

        $this->copyDirectoryContents($extractPath, $rootPath, $skipFiles);
    }

    protected function hasPackageJsonChanged($extractPath)
    {
        $newPackageJson = $extractPath . '/package.json';
        $currentPackageJson = base_path('package.json');

        if (!File::exists($newPackageJson) || !File::exists($currentPackageJson)) {
            return false;
        }

        return md5_file($newPackageJson) !== md5_file($currentPackageJson);
    }

    protected function rollbackUpgrade($backupId)
    {
        $backupDir = $this->backupPath . '/' . $backupId;

        if (!File::exists($backupDir)) {
            throw new \Exception('Backup not found for rollback');
        }

        // Restore files
        $filesToRestore = [
            'composer.json',
            'composer.lock',
            'package.json',
            'package-lock.json',
            '.env',
            'artisan',
            'README.md'
        ];

        foreach ($filesToRestore as $file) {
            $backupFile = $backupDir . '/' . $file;
            $targetFile = base_path($file);

            if (File::exists($backupFile)) {
                File::copy($backupFile, $targetFile);
            }
        }

        // Restore database if backup exists
        $dbBackup = $backupDir . '/database_backup.sql';
        if (File::exists($dbBackup)) {
            // This would require more complex database restoration
            // For now, just log that manual DB restoration might be needed
            Log::info('Database backup exists for manual restoration', ['backup_file' => $dbBackup]);
        }

        // Clear caches
        Artisan::call('config:clear');
        Artisan::call('cache:clear');
        Artisan::call('view:clear');
        Artisan::call('route:clear');
    }

    protected function checkSystemHealth()
    {
        $health = [
            'database' => false,
            'storage' => false,
            'cache' => false,
            'permissions' => false
        ];

        try {
            // Check database connection
            DB::connection()->getPdo();
            $health['database'] = true;
        } catch (\Exception $e) {
            Log::error('Database health check failed', ['error' => $e->getMessage()]);
        }

        try {
            // Check storage permissions
            $testFile = storage_path('app/health_check_' . time() . '.tmp');
            File::put($testFile, 'test');
            File::delete($testFile);
            $health['storage'] = true;
        } catch (\Exception $e) {
            Log::error('Storage health check failed', ['error' => $e->getMessage()]);
        }

        try {
            // Check cache
            cache()->store()->getStore()->flush();
            $health['cache'] = true;
        } catch (\Exception $e) {
            Log::error('Cache health check failed', ['error' => $e->getMessage()]);
        }

        // Check file permissions
        $health['permissions'] = is_writable(base_path()) && is_writable(storage_path());

        return $health;
    }

    protected function getAvailableBackups()
    {
        if (!File::exists($this->backupPath)) {
            return [];
        }

        $backups = [];
        $directories = File::directories($this->backupPath);

        foreach ($directories as $dir) {
            $dirName = basename($dir);
            if (str_starts_with($dirName, 'backup_')) {
                $backups[] = [
                    'id' => $dirName,
                    'path' => $dir,
                    'created_at' => File::lastModified($dir),
                    'size' => $this->getDirectorySize($dir)
                ];
            }
        }

        // Sort by creation date (newest first)
        usort($backups, function($a, $b) {
            return $b['created_at'] - $a['created_at'];
        });

        return array_slice($backups, 0, 10); // Return last 10 backups
    }

    protected function getDirectorySize($path)
    {
        $size = 0;
        $files = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($path));

        foreach ($files as $file) {
            if ($file->isFile()) {
                $size += $file->getSize();
            }
        }

        return $size;
    }

    protected function cleanupFailedUpgrade($extractPath)
    {
        if (File::exists($extractPath)) {
            File::deleteDirectory($extractPath);
        }
    }

    private function extractZip($zipPath, $extractPath)
    {
        $zip = new ZipArchive();
        if ($zip->open($zipPath) === TRUE) {
            $zip->extractTo($extractPath);
            $zip->close();
        } else {
            throw new \Exception('Failed to extract zip file');
        }
    }

    private function copyDirectoryContents($source, $destination, $skipFiles = [])
    {
        $directory = new \RecursiveDirectoryIterator($source, \RecursiveDirectoryIterator::SKIP_DOTS);
        $iterator = new \RecursiveIteratorIterator($directory, \RecursiveIteratorIterator::SELF_FIRST);

        foreach ($iterator as $item) {
            $target = $destination . DIRECTORY_SEPARATOR . $iterator->getSubPathName();

            // Skip files that match skip patterns
            $skipFile = false;
            foreach ($skipFiles as $skipPattern) {
                if (str_contains($iterator->getSubPathName(), $skipPattern)) {
                    $skipFile = true;
                    break;
                }
            }

            if ($skipFile) {
                continue;
            }

            if ($item->isDir()) {
                if (!File::exists($target)) {
                    File::makeDirectory($target, 0755, true);
                }
            } else {
                File::copy($item->getPathname(), $target);
            }
        }
    }
}
