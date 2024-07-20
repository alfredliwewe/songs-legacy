<?php
session_start();
require '../../db.php';
require '../../mail.php';
require '../../functions.php';
require '../../imageClass.php';
$time = time();

if (isset($_GET['getArtist'])) {
	$profile = getData("artists", ['id' => (int)$_GET['getArtist']]);

	header('Content-Type: application/json; charset=utf-8');
	if ($profile != null) {
		$artist_data = getData("web_artists", ['id' => $profile['profile']]);

		if ($artist_data != null) {
			$artist_data['status'] = true;
			echo json_encode($artist_data);
		}
		else{
			echo json_encode(['status' => false, 'message' => "Artist profile not linked"]);
		}
	}
	else{
		echo json_encode(['status' => false, 'message' => "User not found"]);
	}
}
elseif (isset($_POST['artist_name_update'], $_POST['biography'], $_POST['website'], $_POST['country'])) {
	$profile = getData("artists", ['id' => $_SESSION['data']['id']]);
	$artist_id = $profile['profile'];

	$name = $db->real_escape_string($_POST['artist_name_update']);
	$biography = $db->real_escape_string($_POST['biography']);
	$website = $db->real_escape_string($_POST['website']);
	$country = $db->real_escape_string($_POST['country']);

	$upd = $db->query("UPDATE web_artists SET name = '$name', biography = '$biography', website = '$website', country = '$country' WHERE id = '$artist_id' ");
	if ($db->affected_rows > 0) {
		echo json_encode(['status' => true]); 
	}
	else{
		echo json_encode(['status' => false, 'message' => "Could not update - $artist_id - ".$db->error]);
	}
}
elseif (isset($_GET['getCountries'])) {
	$data = [];
	$read = $db->query("SELECT * FROM countries ORDER BY name");
	while ($row = $read->fetch_assoc()) {
		array_push($data, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($data);
}

elseif (isset($_GET['getAlbums'])) {
	$artist_id = getData("artists", ['id' => (int)$_GET['getAlbums']])['profile'];
	//$artist_id = $_SESSION['data']['profile'];

	$data = [];
	$read = $db->query("SELECT * FROM web_albums WHERE artist = '$artist_id' ");
	while ($row = $read->fetch_assoc()) {
		array_push($data, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($data);
}
elseif (isset($_POST['album_name'], $_POST['year'], $_POST['link'], $_FILES['artwork'])) {
	$name = $db->real_escape_string($_POST['album_name']);
	$year = (int)$_POST['year'];
	$link = $db->real_escape_string($_POST['link']);

	$artist_id = $_SESSION['data']['profile'];

	$filename = $_FILES['artwork']['name'];

	if (move_uploaded_file($_FILES['artwork']['tmp_name'], "../../artwork/album/$filename")) {
		$ins = $db->query("INSERT INTO `web_albums`(`id`, `name`, `webid`, `link`, `artist`, `image`, `status`, `website`, `year`, `date_added`) VALUES (NULL, '$name', '0', '$link', '$artist_id', '$filename', 'active', '','$year', '$time')");
		echo json_encode(['status' => true]);
	}
}
elseif (isset($_GET['getUserData'])) {
	$user_id = (int)$_GET['getUserData'];

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode(getData("artists", ['id' => $user_id]));
}
elseif (isset($_POST['resendVerification'])) {
	$id = (int)$_POST['resendVerification'];

	$data = getData("artists", ['id' => $id]);
	$fullname = $data['name'];

	$link = $config['host']."access/?verify=".$data['ref'];

	//sendEmail
	$html = "Dear $fullname,

	Thank you for registering as an artist on ".$config['name']."! We're excited to have you join our community of talented musicians.

	To complete the registration process and activate your artist account, please verify your email address by clicking on the following link:

	<a href=\"$link\">$link</a>

	Once you've clicked the link, you'll be all set to upload your music, connect with fans, and explore the various features our platform offers.

	If you encounter any issues during the verification process or have any questions about using our platform, don't hesitate to reach out to our support team at {$config['support-email']}.

	We can't wait to see what you create and share with the world!

	Best regards,
	Alfred Liwewe
	Managing Director
	+265992 92 11 34";
	$result = sendEmail($data['email'], "Verify Your Artist Registration on ".$config['name'], nl2br($html));

	echo json_encode(['status' => true, 'message' => "Verification sent", 'result' => $result]);
}
elseif (isset($_FILES['artist_picture'], $_POST['user'])) {
	$filename = $_FILES['artist_picture']['name'];

	$ext = fileExtension($filename);

	if (in_array($ext, ["png", "jpg", "jpeg", "gif", "webp"])) {
		$filename = Crypto::letters_numbers(32).".$ext";

		if (move_uploaded_file($_FILES['artist_picture']['tmp_name'], "../../uploads/artists/$filename")) {
			$data = getData("artists", ['id' => (int)$_POST['user']]);

			$resampled = Crypto::letters_numbers(32).".png";
			$img = new rodzImage("../../uploads/artists/$filename");
			$img->cropImage("../../uploads/artists/$resampled");

			db_update("web_artists", ['photo' => $filename, 'resampled' => $resampled], ['id' => $data['profile']]);

			echo json_encode(['status' => true, 'message' => "Success"]);
		}
		else{
			echo "Failed to update";
		}
	}
	else{
		echo json_encode(['status' => false, 'message' => "Unsupported file type"]);
	}
}
elseif (isset($_GET['getGenres'])) {
	$genres = [];
	$sql = $db->query("SELECT id,name,status FROM genre");
	while ($row = $sql->fetch_assoc()) {
		$row['songs'] = (int)$db->query("SELECT COUNT(id) AS count_all FROM web_songs WHERE genre = '{$row['id']}' ")->fetch_assoc()['count_all'];
		//$row['songs'] = 0;
		array_push($genres, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($genres);
}
elseif (isset($_GET['getSongs'])) {
	$data = getData("artists", ['id' => (int)$_GET['getSongs']]);
	$artist_data = getData("web_artists", ['id' => $data['profile']]);
	$artist_id=$data['profile'];

	$genres = [];
	$sql = $db->query("SELECT * FROM genre");
	while ($row = $sql->fetch_assoc()) {
		$genres[$row['id']] = $row;
	}

	$genres[0] = ['id' => 0, 'name' => ""];

	$albums = [];
	$sql = $db->query("SELECT * FROM web_albums WHERE artist = '$artist_id' ");
	while ($row = $sql->fetch_assoc()) {
		$albums[$row['id']] = $row;
	}

	$data = [];
	$read = $db->query("SELECT * FROM web_songs WHERE artist = '{$artist_data['id']}' ");
	while ($row = $read->fetch_assoc()) {
		$row['genre_data']= $genres[$row['genre']];
		$row['genre'] = $row['genre'];
		$row['name'] = $artist_data['name'];

		$row['album_data'] = isset($albums[$row['album']]) ? $albums[$row['album']] : ['id' => 0, 'name' => 'Single'];
		array_push($data, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($data);
}
elseif (isset($_GET['getListening30Data'], $_GET['user'])) {
	$labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	$values = [0,0,0,0,0,0,0,0,0,0,0,0];

	$year = (int)$_GET['getListening30Data'];
	$year = $year == 0 ? date('Y') : $year;

	$startTime = strtotime("1 January $year");
	$endTime = strtotime("31 December $year");

	$data = getData("artists", ['id' => (int)$_GET['user']]);
	$artist_id = $data['profile'];

	$read = $db->query("SELECT * FROM song_plays WHERE time BETWEEN '$startTime' AND '$endTime' AND song IN (SELECT id FROM web_songs WHERE artist = '$artist_id')");
	while ($row = $read->fetch_assoc()) {
		$values[(int)date('n', $row['time']) - 1] += 1;
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode(['labels' => $labels, 'values' => $values]);
}
elseif (isset($_GET['getSongsListenData'])) {
	// code...
}
else{
	echo json_encode(['status' => false, 'message' => "No data"]);
}
?>