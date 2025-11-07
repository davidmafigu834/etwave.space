<?php

/**
 * Laravel - A PHP Framework For Web Artisans
 * Front controller for web requests.
 */

// -----------------------------------------------------------------------------
// Bootstrap the framework
// -----------------------------------------------------------------------------

// Start Laravel performance timer
define('LARAVEL_START', microtime(true));

// Composer autoloader
require __DIR__ . '/../vendor/autoload.php';

// Turn on the lights
$app = require_once __DIR__ . '/../bootstrap/app.php';

// Handle the request through the kernel
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

$response->send();

$kernel->terminate($request, $response);
