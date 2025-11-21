<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

try {
    echo "Modifying media_assets table...\n";
    Schema::table('media_assets', function (Blueprint $table) {
        $table->string('kind', 255)->change();
    });
    echo "Successfully modified 'kind' column in 'media_assets' table.\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
