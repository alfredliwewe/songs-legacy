<?php 
session_start();
require 'db.php';

if (isset($_GET['id'])) {
	$song_id = (int)trim($_GET['id']);

	$read = $db->query("SELECT title,name,mp3_url FROM web_songs JOIN web_artists ON web_songs.artist = web_artists.id WHERE web_songs.id = '$song_id' ");
	if ($read->num_rows > 0) {
		$data = $read->fetch_assoc();

		$mp3_url = $data['mp3_url'];
		//$mp3_url = "http://169.254.65.21/songs/songs/phy.mp3";

		$new_file_name = "tmp/".$data['title']."_".$data['name']." [Amuze].mp3";
    	copy($mp3_url, $new_file_name);

    	header('Content-Description: File Transfer');
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="'.basename($new_file_name).'"');
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-Length: ' . filesize($new_file_name));
        readfile($new_file_name);

        //unlink($new_file_name);
        $db->query("UPDATE web_songs SET downloads = downloads + 1 WHERE id = '$song_id' ");
	}
	else{
		$_SESSION['error'] = "Song not found";
		header("location: error.php");
	}
}
?>