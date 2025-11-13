<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Artisan;
use Inertia\Inertia;
use ZipArchive;

class UpgradeController extends Controller
{
    public function index()
    {
        return Inertia::render('upgrade/index', [
            'uploadedFile' => session('upgrade_uploaded_file')
        ]);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'upgrade_file' => 'required|file|mimes:zip|max:100000' // 100MB max
        ]);

        $file = $request->file('upgrade_file');
        $filename = 'upgrade_' . time() . '.zip';
        $path = $file->storeAs('upgrades', $filename, 'local');

        // Debug: Check where file was actually saved
        $fullPath = storage_path('app/' . $path);
        $exists = \File::exists($fullPath);

        // Store in session
        session(['upgrade_uploaded_file' => $path]);

        return back()->with([
            'success' => 'Upgrade file uploaded successfully',
            'debug' => "File saved to: {$fullPath}, Exists: " . ($exists ? 'Yes' : 'No')
        ]);
    }

    public function apply(Request $request)
    {
        $request->validate([
            'file_path' => 'required|string'
        ]);

        // Debug: Show what was received
        $receivedPath = $request->file_path;
        $sessionPath = session('upgrade_uploaded_file');
        $fullPath = storage_path('app/' . $receivedPath);
        $exists = \File::exists($fullPath);

        // Check if file exists
        if (!File::exists($fullPath)) {
            return back()->withErrors(['file_path' => "File not found. Received: '{$receivedPath}', Session: '{$sessionPath}', Full path: '{$fullPath}', Exists: " . ($exists ? 'Yes' : 'No')]);
        }

        $filePath = $fullPath;

        try {
            // Create backup
            $this->createBackup();

            // Extract zip
            $extractPath = storage_path('app/upgrades/temp_' . time());
            $this->extractZip($filePath, $extractPath);

            // Apply upgrade
            $this->applyUpgrade($extractPath);

            // Clean up
            File::delete($filePath);
            File::deleteDirectory($extractPath);

            // Clear session
            session()->forget('upgrade_uploaded_file');

            return back()->with('success', 'Upgrade applied successfully');

        } catch (\Exception $e) {
            return back()->withErrors(['upgrade' => 'Upgrade failed: ' . $e->getMessage()]);
        }
    }

    private function createBackup()
    {
        $backupPath = storage_path('app/backups/backup_' . date('Y_m_d_H_i_s'));
        $rootPath = base_path();

        // Copy important directories
        $directoriesToBackup = ['app', 'database', 'resources', 'routes', 'public'];

        foreach ($directoriesToBackup as $dir) {
            $source = $rootPath . '/' . $dir;
            $destination = $backupPath . '/' . $dir;

            if (File::exists($source)) {
                File::copyDirectory($source, $destination);
            }
        }

        // Backup composer.json and other root files
        $filesToBackup = ['composer.json', 'composer.lock', 'package.json', 'package-lock.json'];
        foreach ($filesToBackup as $file) {
            $source = $rootPath . '/' . $file;
            if (File::exists($source)) {
                File::copy($source, $backupPath . '/' . $file);
            }
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

    private function applyUpgrade($extractPath)
    {
        $rootPath = base_path();

        // Copy files from extract path to root
        $this->copyDirectoryContents($extractPath, $rootPath);

        // Run migrations if any
        Artisan::call('migrate', ['--force' => true]);

        // Run seeders if needed
        // Artisan::call('db:seed', ['--force' => true]);

        // Clear caches
        Artisan::call('config:clear');
        Artisan::call('cache:clear');
        Artisan::call('view:clear');
        Artisan::call('route:clear');
    }

    private function copyDirectoryContents($source, $destination)
    {
        $directory = new \RecursiveDirectoryIterator($source, \RecursiveDirectoryIterator::SKIP_DOTS);
        $iterator = new \RecursiveIteratorIterator($directory, \RecursiveIteratorIterator::SELF_FIRST);

        foreach ($iterator as $item) {
            $target = $destination . DIRECTORY_SEPARATOR . $iterator->getSubPathName();

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
