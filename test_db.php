<?php
$servername = "127.0.0.1";
$username = "adlense1_etwave";
$password = "@dstar12b";
$dbname = "adlense1_etwave";

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    echo "Connected successfully";
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
?>
