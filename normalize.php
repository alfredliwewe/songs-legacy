<?php

$db = new sqlite3("dt/src/main.db");
require 'validation.php';
$sql = $db->query("SELECT * FROM visitors");
while ($row = $sql->fetchArray()) {
	$phone = $row['phone'];

	$real_phone = real_phone($phone);
	$db->exec("UPDATE visitors SET phone = '$real_phone' WHERE phone = '$phone' ");
}