<?php
session_start();
$dbx = new sqlite3("dt/src/main.db");
require 'device.php';
require 'functions.php';
require 'language.php';
require 'config.php';

visit("home");
$client = new client_info;
$client_os = $client->os;
$client_browser = $client->browser_name;
$device_type = $client->device;

$_SESSION['device'] = $device_type;

if (isset($_GET['language'])) {
    $language = $_GET['language'];
    $array_languages = array('english', 'chichewa');
    if (in_array($language, $array_languages)) {
        $_SESSION['language'] = $language;
    }
}
elseif(isset($_SESSION['language'])) {
    $language = $_SESSION['language'];
}
else{
    $language = "english";
}
?>
<!DOCTYPE html>
<html>
<head>
    <title><?=$config['name'];?> - <?php echo $languages[$language]['stream'];?></title>
    <?php require 'links.php';?>
</head>
<body>
    <?php require 'left-bar.php';?>