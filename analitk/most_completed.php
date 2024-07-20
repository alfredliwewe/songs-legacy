<?php

require '../db.php';
require '../includes/Sort.php';

$artists = [];

$read = $db->query("SELECT * FROM web_artists WHERE id IN (SELECT DISTINCT artist FROM song_plays)");
//echo "Found ".$read->num_rows." <br>";
while ($row = $read->fetch_assoc()) {
	$artists[$row['id']] = $row;
}

//echo count($artists);
$mega = [];

$sql = $db->query("SELECT DISTINCT song,artist FROM song_plays WHERE artist != '0'");
while ($row = $sql->fetch_assoc()) {
	$average = $db->query("SELECT AVG(progress) AS average, count(progress) AS count FROM song_plays WHERE song = '{$row['song']}' ")->fetch_assoc()['average'];
	$mega[(string)$row['song']] = (int)$average;
}

//arsort($mega);
$sorted = Sort::valuesDesc2($mega);
//header('Content-Type: application/json; charset=utf-8');
$values = array_values($sorted);
//echo json_encode(Sort::desc($values));
echo var_dump($sorted);