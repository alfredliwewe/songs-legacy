<?php
session_start();
$dbx = new sqlite3("dt/src/main.db");
require 'functions.php';

if (isset($_POST['text'])) {
	$text = $dbx->escapeString($_POST['text']);
	$res = $dbx->query("SELECT * FROM songs WHERE title LIKE '%{$text}%' OR artist LIKE '%{$text}%' LIMIT 10");

	$count = 0;

	while ($row = $res->fetchArray()) {
		echo "<div class='w3-padding w3-border-bottom pointer w3-hover-light-grey' onclick=\"window.location = 'song/?id={$row['id']}'\"><b>{$row['artist']}</b><br>{$row['title']}</div>";
		$count += 1;
	}

	if ($count == 0) {
		echo "<p class='text-danger'>Your search <b>".$_POST['text']."</b>, didn't find a match</p>";
	}
}
?>