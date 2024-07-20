<?php
session_start();

session_unset();
session_destroy();

//destroy cookies
//setcookie('user_id', "", time()-3600);
setcookie('logged_user_id', '', time()-3600);

header("location: index.php");
?>