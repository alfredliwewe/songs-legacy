<?php
require '../../db.php';

$text = explode("\n", file_get_contents("america"));
$sql = "";
foreach ($text as $li) {
	$name = trim(trim(strip_tags($li)));
	$name = $db->real_escape_string($name);
	$res = $db->query("SELECT * FROM web_artists WHERE name = '$name' ");
	if ($res->num_rows > 0) {
		$data = $res->fetch_assoc();
		$sql .= "\n\nUPDATE web_artists SET country = '192' WHERE id = '{$data['id']}'; ";
	}
	echo "$name<br>";
}

file_put_contents('query.sql', $sql);