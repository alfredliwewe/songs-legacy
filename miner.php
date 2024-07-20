<?php 
require 'imageClass.php';
$db = new sqlite3("dt/src/main.db");

$read = $db->query("SELECT * FROM songs");
while ($row = $read->fetchArray()) {
	if (file_exists("artwork/".$row['artwork'])) {
		$img = new rodzImage("artwork/".$row['artwork']);
		$resampled = rand(10001,99999)."_".rand(10001,99999).".png";
		$img->cropImage("artwork/".$resampled);
		$db->query("UPDATE songs SET resampled_artwork = '$resampled' WHERE id = '{$row['id']}' ");
	}
}

echo "done";