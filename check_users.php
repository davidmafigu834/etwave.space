<?php
require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== USER TYPES IN DATABASE ===\n";
$users = DB::table('users')->select('id', 'email', 'type')->get();

foreach ($users as $user) {
    echo "ID: {$user->id} | Email: {$user->email} | Type: " . ($user->type ?? 'NULL') . "\n";
}

echo "\n=== CHECKING AUTHENTICATED USER ===\n";
if (auth()->check()) {
    $user = auth()->user();
    echo "Logged in as: {$user->email} (Type: " . ($user->type ?? 'NULL') . ")\n";
} else {
    echo "No user is currently authenticated\n";
}
?>
