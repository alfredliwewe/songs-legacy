<?php 
require 'db.php';

$song_id = 4503;

$time_limit = time() - (30 * 24 * 3600);

//get users who played this song
$users = [];
$songs = [];

$read = $db->query("SELECT DISTINCT user FROM song_plays WHERE song = '$song_id' AND `time` > '$time_limit' ");

while($row = $read->fetch_assoc()){
	$in_read = $db->query("SELECT * FROM song_plays WHERE user = '{$row['user']}' AND `time` > '$time_limit' ");
	while ($r = $in_read->fetch_assoc()) {
		if (isset($songs[$r['song']])) {
			$songs[$r['song']] += 1;
		}
		else{
			$songs[$r['song']] = 1;
		}
	}
}

//sort by values
arsort($songs);

$data = [];

foreach ($songs as $key => $value) {
	$read = $db->query("SELECT web_songs.id AS id, web_songs.title AS title, web_songs.resampled_artwork AS artwork, resampled_artwork, web_artists.name AS name, artist, downloads, plays FROM web_songs JOIN web_artists ON web_songs.artist = web_artists.id WHERE web_songs.id = '$key' ");
	if ($read->num_rows > 0) {
		$row = $read->fetch_assoc();
		$song_id = $row['id'];

		$row['featured'] = "";
		$row['artist_data'] = $db->query("SELECT * FROM web_artists WHERE id = '{$row['artist']}' ")->fetch_assoc();
	    if ($row['artist_data'] != null) {
	    	$row['comments'] = $db->query("SELECT * FROM comments WHERE song = '$song_id' ")->num_rows;
	        $row['artist'] = $row['artist_data']['name'];
			array_push($data, $row);
	    }
	}
}

echo json_encode($data);
?>