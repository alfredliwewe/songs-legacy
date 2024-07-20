<?php
require '../../db.php';
require '../../includes/String.php';

$artists = [];
$read = $db->query("SELECT id,name FROM web_artists");
while ($row = $read->fetch_assoc()) {
	$artists[$row['id']] = $row['name'];
}

$values = [];
$sql = "INSERT INTO `search`(`id`, `text`, `ref`, `type`) VALUES ";
$read = $db->query("SELECT id,title,artist FROM web_songs");
while ($row = $read->fetch_assoc()) {
	$title = $db->real_escape_string(Strings::trim($row['title'], 4));
	$artist = $db->real_escape_string($artists[$row['artist']]);

	//echo "$title by $artist<br/>";
	array_push($values, "(NULL, '$title', '{$row['id']}', 'song')");
	array_push($values, "(NULL, '$artist', '{$row['artist']}', 'artist')");
	array_push($values, "(NULL, '$title $artist', '{$row['id']}', 'song')");
	array_push($values, "(NULL, '$artist $title', '{$row['id']}', 'song')");
	array_push($values, "(NULL, '$title by $artist', '{$row['id']}', 'song')");
}

$chuncks = array_chunk($values, 90);
$text = "";
foreach ($chuncks as $chunk) {
	$text .= $sql.implode(",\n", $chunk).";\n\n";
}

file_put_contents("output.sql", $text);

echo "done";
?>