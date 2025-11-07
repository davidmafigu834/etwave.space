<?php
$logFile = 'storage/logs/laravel.log';
if (file_exists($logFile)) {
    $lines = file($logFile);
    $start = max(0, count($lines) - 20);
    for ($i = $start; $i < count($lines); $i++) {
        echo ($i + 1) . ': ' . trim($lines[$i]) . "\n";
    }
} else {
    echo "Log file not found\n";
}
?>
