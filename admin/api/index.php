<?php
session_start();
require '../../db.php';
require '../../functions.php';
require '../../imageClass.php';
require '../../includes/String.php';
$time = time();

if (isset($_POST['login_email'], $_POST['password'])) {
	$email = $db->real_escape_string($_POST['login_email']);
	$password = md5($_POST['password']);

	$read = $db->query("SELECT * FROM admins WHERE email = '$email' AND password = '$password' ");
	if ($read->num_rows > 0) {
		$data = $read->fetch_assoc();
		$_SESSION['data'] = $data;
		$_SESSION['user_id'] = $data['id'];

		echo json_encode(['status' => true]);
	}
	else{
		echo json_encode(['status' => false, 'message' => "Login failed! Wrong details"]);
	}
}
elseif(isset($_GET['getArtists'])){
	$start = (int)$_GET['start'];
	$limit = (int)$_GET['limit'];
	$country = (int)$_GET['country'];

	$countries = getCountries($db);

	$where = "";
	if ($country != 0) {
		$where = " WHERE country = '$country' ";
	}

	$data = [];
	$read = $db->query("SELECT * FROM web_artists $where LIMIT $start,$limit");
	while ($row = $read->fetch_assoc()) {
		$row['country_data']= $countries[$row['country']];
		array_push($data, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($data);
}
elseif(isset($_GET['searchArtist'])){
	$text = $db->real_escape_string($_GET['searchArtist']);

	$countries = [];
	$sql = $db->query("SELECT * FROM countries");
	while ($row = $sql->fetch_assoc()) {
		$countries[$row['id']] = $row;
	}

	$countries[0] = ['id' => 0, 'name' => ""];

	$where = "";
	if (isset($_GET['country'])) {
		$where = " AND country = '".$_GET['country']."' ";
	}

	$data = [];
	$read = $db->query("SELECT * FROM web_artists WHERE name LIKE '%$text%' $where LIMIT 20");
	while ($row = $read->fetch_assoc()) {
		$row['country_data']= $countries[$row['country']];
		array_push($data, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($data);
}
elseif(isset($_GET['searchArtistNoCountry'])){
	$text = $db->real_escape_string($_GET['searchArtistNoCountry']);

	$data = [];
	$read = $db->query("SELECT * FROM web_artists WHERE name LIKE '%$text%' AND country = '0' LIMIT 20");
	while ($row = $read->fetch_assoc()) {
		array_push($data, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($data);
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
elseif (isset($_GET['getAdmins'])) {
	$data = [];
	$read = $db->query("SELECT * FROM admins");
	while ($row = $read->fetch_assoc()) {
		array_push($data, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($data);
}
elseif (isset($_GET['getUsers'])) {
	$data = [];
	$countries = [];
	$sql = $db->query("SELECT * FROM countries");
	while ($row = $sql->fetch_assoc()) {
		$countries[$row['id']] = $row;
	}

	$countries[0] = ['id' => 0, 'name' => ""];

	$read = $db->query("SELECT * FROM users");
	while ($row = $read->fetch_assoc()) {
		$row['country_data'] = $countries[$row['country']];
		array_push($data, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($data);
}
elseif (isset($_POST['artist_id'], $_POST['artist_name_edit'], $_POST['webid'], $_POST['biography'])) {
	$id = (int)$_POST['artist_id'];
	$name = $db->real_escape_string($_POST['artist_name_edit']);
	$webid = $db->real_escape_string($_POST['webid']);
	$biography = $db->real_escape_string($_POST['biography']);
	$country = (int)$_POST['country'];

	$upd = $db->query("UPDATE web_artists SET name = '$name', webid = '$webid', biography = '$biography', country = '$country' WHERE id = '$id' ");
	//header('Content-Type: application/json; charset=utf-8');
	if ($upd) {
		echo json_encode(['status' => true]);
	}
	else{
		echo json_encode(['status' => false, 'message' => $db->error]);
	}
}
elseif (isset($_GET['countArtists'])) {
	$count = $db->query("SELECT COUNT(id) AS count_all FROM web_artists")->fetch_assoc()['count_all'];
	header('Content-Type: application/json; charset=utf-8');
	echo json_encode(['count' => $count]);
}
elseif (isset($_GET['countSongs'])) {
	$count = $db->query("SELECT COUNT(id) AS count_all FROM web_songs")->fetch_assoc()['count_all'];
	header('Content-Type: application/json; charset=utf-8');
	echo json_encode(['count' => $count]);
}
elseif (isset($_GET['getCharts'])) {
	$data = [];
	$read = $db->query("SELECT * FROM charts WHERE status = 'active' ");
	while ($row = $read->fetch_assoc()) {
		$row['songs'] = $db->query("SELECT COUNT(id) AS count_all FROM chart_list WHERE chart = '{$row['id']}' ")->fetch_assoc()['count_all'];
		array_push($data, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($data);
}
elseif (isset($_GET['getPlaylists'])) {
	$data = [];
	$read = $db->query("SELECT * FROM playlist_admin WHERE status = 'active' ");
	while ($row = $read->fetch_assoc()) {
		$row['songs'] = $db->query("SELECT COUNT(id) AS count_all FROM play_list_songs WHERE chart = '{$row['id']}' ")->fetch_assoc()['count_all'];
		array_push($data, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($data);
}
elseif (isset($_GET['getAdverts'])) {
	$data = [];
	$read = $db->query("SELECT * FROM adverts WHERE status = 'active' ");
	while ($row = $read->fetch_assoc()) {
		//$row['songs'] = $db->query("SELECT COUNT(id) AS count_all FROM chart_list WHERE chart = '{$row['id']}' ")->fetch_assoc()['count_all'];
		$row['date']= date('d-M-Y', $row['dateAdded']);
		array_push($data, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($data);
}
elseif (isset($_POST['chart_name'], $_FILES['picture'], $_POST['country'], $_POST['biography'])) {
	$name = $db->real_escape_string($_POST['chart_name']);
	$description = $db->real_escape_string($_POST['biography']);
	$country = (int)trim($_POST['country']);

	$filename = $_FILES['picture']['name'];

	if (move_uploaded_file($_FILES['picture']['tmp_name'], "../../uploads/$filename")) {
		$ins = $db->query("INSERT INTO `charts`(`id`, `name`, `description`, `picture`, `parent`, `actions`, `status`, `country`) VALUES (NULL, '$name', '$description', '$filename', '0', '0', 'active', '$country')");
		echo json_encode(['status' => true]);
	}
	else{
		echo json_encode(['status' => false, 'message' => "Failed to upload file"]);
	}
}
elseif (isset($_POST['play_list_name'], $_FILES['picture'], $_POST['country'], $_POST['biography'])) {
	$name = $db->real_escape_string($_POST['play_list_name']);
	$description = $db->real_escape_string($_POST['biography']);
	$country = (int)trim($_POST['country']);

	$filename = $_FILES['picture']['name'];

	if (move_uploaded_file($_FILES['picture']['tmp_name'], "../../uploads/$filename")) {
		$ins = $db->query("INSERT INTO `playlist_admin`(`id`, `name`, `description`, `picture`, `parent`, `actions`, `status`, `country`) VALUES (NULL, '$name', '$description', '$filename', '0', '0', 'active', '$country')");
		echo json_encode(['status' => true]);
	}
	else{
		echo json_encode(['status' => false, 'message' => "Failed to upload file"]);
	}
}
elseif (isset($_FILES['change_chart_picture'], $_POST['chart_id'])) {
	$filename = $_FILES['change_chart_picture']['name'];
	$chart_id = (int)$_POST['chart_id'];

	if (move_uploaded_file($_FILES['change_chart_picture']['tmp_name'], "../../uploads/$filename")) {
		$db->query("UPDATE charts SET picture = '$filename' WHERE id = '$chart_id' ");
		echo json_encode(['status' => true, 'picture' => $filename]);
	}
	else{
		echo json_encode(['status' => false, 'message' => "Failed to upload picture"]);
	}
}
elseif (isset($_FILES['change_list_picture'], $_POST['chart_id'])) {
	$filename = $_FILES['change_list_picture']['name'];
	$chart_id = (int)$_POST['chart_id'];

	if (move_uploaded_file($_FILES['change_list_picture']['tmp_name'], "../../uploads/$filename")) {
		$db->query("UPDATE playlist_admin SET picture = '$filename' WHERE id = '$chart_id' ");
		echo json_encode(['status' => true, 'picture' => $filename]);
	}
	else{
		echo json_encode(['status' => false, 'message' => "Failed to upload picture"]);
	}
}
elseif (isset($_GET['getChartSongs'])) {
	$chart_id = (int)$_GET['getChartSongs'];

	$songs = [];
	$read1 = $db->query("SELECT web_songs.id,web_songs.title, mp3_url, artwork, artist, resampled_artwork, name,chart,chart_list.id AS chart_id FROM chart_list JOIN web_songs ON chart_list.song = web_songs.id JOIN web_artists ON web_songs.artist = web_artists.id WHERE chart = '$chart_id' ");
	while ($row1 = $read1->fetch_assoc()) {
		array_push($songs, $row1);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($songs);
}
elseif (isset($_GET['getChartSongsList'])) {
	$chart_id = (int)$_GET['getChartSongsList'];

	$songs = [];
	$read1 = $db->query("SELECT web_songs.id,web_songs.title, mp3_url, artwork, artist, resampled_artwork, name,chart,play_list_songs.id AS chart_id FROM play_list_songs JOIN web_songs ON play_list_songs.song = web_songs.id JOIN web_artists ON web_songs.artist = web_artists.id WHERE chart = '$chart_id' ");
	while ($row1 = $read1->fetch_assoc()) {
		array_push($songs, $row1);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($songs);
}
elseif (isset($_POST['removeFromList'])) {
	$id = (int)trim($_POST['removeFromList']);
	$db->query("DELETE FROM play_list_songs WHERE id = '$id' ");
	echo json_encode(['status' => true]);
}
elseif (isset($_POST['removeFromChartList'])) {
	$id = (int)trim($_POST['removeFromChartList']);
	$db->query("DELETE FROM chart_list WHERE id = '$id' ");
	echo json_encode(['status' => true]);
}
elseif (isset($_GET['searchSong'])) {
	$data = [];
	$chars = explode(" by ", $_GET['searchSong']);
	if (count($chars) == 2) {
		$title = $db->real_escape_string($chars[0]);
		$artist = $db->real_escape_string($chars[1]);

		$read = $db->query("SELECT web_songs.id AS song_id,title,name,web_songs.genre FROM web_songs JOIN web_artists ON web_songs.artist = web_artists.id WHERE name LIKE '%{$artist}%' AND title LIKE '%{$title}%' LIMIT 20");
		while ($row = $read->fetch_assoc()) {
			$row['type'] = 'malawi';
			array_push($data, $row);
		}
	}
	else{
		$search = $db->real_escape_string($_GET['searchSong']);

		
		$read = $db->query("SELECT web_songs.id AS song_id,title,name,web_songs.genre FROM web_songs JOIN web_artists ON web_songs.artist = web_artists.id WHERE title LIKE '%{$search}%' LIMIT 20");
		while ($row = $read->fetch_assoc()) {
			$row['type'] = 'local';
			//$row['song_id'] = $row['id'];
			array_push($data, $row);
		}

		$read = $db->query("SELECT web_songs.id AS song_id,title,name,web_songs.genre FROM web_songs JOIN web_artists ON web_songs.artist = web_artists.id WHERE name LIKE '%{$search}%' LIMIT 20");
		while ($row = $read->fetch_assoc()) {
			$row['type'] = 'malawi';
			array_push($data, $row);
		}
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($data);
}
elseif (isset($_GET['searchSong1'])) {
	$data = [];
	$chars = explode(" by ", $_GET['searchSong1']);
	if (count($chars) == 2) {
		$title = $db->real_escape_string($chars[0]);
		$artist = $db->real_escape_string($chars[1]);

		$read = $db->query("SELECT web_songs.id AS song_id,title,name,web_songs.genre FROM web_songs JOIN web_artists ON web_songs.artist = web_artists.id WHERE name LIKE '%{$artist}%' AND title LIKE '%{$title}%' AND web_songs.genre = '0' LIMIT 20");
		while ($row = $read->fetch_assoc()) {
			$row['type'] = 'malawi';
			array_push($data, $row);
		}
	}
	else{
		$search = $db->real_escape_string($_GET['searchSong1']);

		
		$read = $db->query("SELECT web_songs.id AS song_id,title,name,web_songs.genre FROM web_songs JOIN web_artists ON web_songs.artist = web_artists.id WHERE title LIKE '%{$search}%' AND web_songs.genre = '0' LIMIT 20");
		while ($row = $read->fetch_assoc()) {
			$row['type'] = 'local';
			//$row['song_id'] = $row['id'];
			array_push($data, $row);
		}

		$read = $db->query("SELECT web_songs.id AS song_id,title,name,web_songs.genre FROM web_songs JOIN web_artists ON web_songs.artist = web_artists.id WHERE name LIKE '%{$search}%' AND web_songs.genre = '0' LIMIT 20");
		while ($row = $read->fetch_assoc()) {
			$row['type'] = 'malawi';
			array_push($data, $row);
		}
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($data);
}
elseif (isset($_POST['saveToChart'], $_POST['chart'])) {
	$song_id = (int)$_POST['saveToChart'];
	$chart = (int)$_POST['chart'];

	$check = $db->query("SELECT * FROM chart_list WHERE chart = '$chart' AND song = '$song_id' ");
	if ($check->num_rows == 0) {
		$ins = $db->query("INSERT INTO `chart_list`(`id`, `chart`, `song`) VALUES (NULL, '$chart', '$song_id')");
	}
	echo "Success!";
}
elseif (isset($_POST['saveToChartList'], $_POST['chart'])) {
	$song_id = (int)$_POST['saveToChartList'];
	$chart = (int)$_POST['chart'];

	$check = $db->query("SELECT * FROM play_list_songs WHERE chart = '$chart' AND song = '$song_id' ");
	if ($check->num_rows == 0) {
		$ins = $db->query("INSERT INTO `play_list_songs`(`id`, `chart`, `song`) VALUES (NULL, '$chart', '$song_id')");
	}
	echo "Success!";
}
elseif (isset($_GET['getSongs'], $_GET['start'], $_GET['limit'])) {
	$start = (int)$_GET['start'];
	$limit = (int)$_GET['limit'];

	$genres = [];
	$sql = $db->query("SELECT * FROM genre");
	while ($row = $sql->fetch_assoc()) {
		$genres[$row['id']] = $row;
	}

	$genres[0] = ['id' => 0, 'name' => ""];

	$data = [];
	$read = $db->query("SELECT *,web_songs.id AS song_id,web_songs.genre AS genre_id FROM web_songs JOIN web_artists ON web_songs.artist = web_artists.id LIMIT $start,$limit");
	while ($row = $read->fetch_assoc()) {
		$row['genre_data']= $genres[$row['genre_id']];
		$row['genre'] = $row['genre_id'];
		array_push($data, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($data);
}
elseif (isset($_GET['searchSongRow'])) {
	$text = $db->real_escape_string($_GET['searchSongRow']);

	$genres = [];
	$sql = $db->query("SELECT * FROM genre");
	while ($row = $sql->fetch_assoc()) {
		$genres[$row['id']] = $row;
	}

	$genres[0] = ['id' => 0, 'name' => ""];

	$data = [];
	$read = $db->query("SELECT *,web_songs.id AS song_id,web_songs.genre AS genre_id FROM web_songs JOIN web_artists ON web_songs.artist = web_artists.id WHERE title LIKE '%{$text}%' LIMIT 20");
	while ($row = $read->fetch_assoc()) {
		$row['genre_data']= $genres[$row['genre_id']];
		$row['genre'] = $row['genre_id'];
		array_push($data, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($data);
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
elseif (isset($_GET['getArtistAlbums'])) {
	$artist = (int)$_GET['getArtistAlbums'];

	$data = [];

	$read = $db->query("SELECT * FROM web_albums WHERE artist = '$artist' ");
	while ($row = $read->fetch_assoc()) {
		$row['songs'] = (int)$db->query("SELECT COUNT(id) AS count_all FROM web_songs WHERE album = '{$row['id']}' ")->fetch_assoc()['count_all'];
		array_push($data, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($data);
}
elseif (isset($_POST['updateArtistCountry'], $_POST['country'])) {
	$artist = (int)$_POST['updateArtistCountry'];
	$country = (int)$_POST['country'];

	$db->query("UPDATE web_artists SET country = '$country' WHERE id = '$artist' ");
	echo "done";
}
elseif (isset($_GET['getDashboardData'])) {
	$data['songs'] = $db->query("SELECT COUNT(id) AS count_all FROM web_songs")->fetch_assoc()['count_all'];
	$data['artists'] = $db->query("SELECT COUNT(id) AS count_all FROM web_artists")->fetch_assoc()['count_all'];
	$data['genres'] = $db->query("SELECT COUNT(id) AS count_all FROM genre")->fetch_assoc()['count_all'];
	$data['users'] = $db->query("SELECT COUNT(id) AS count_all FROM users")->fetch_assoc()['count_all'];
	$data['charts'] = $db->query("SELECT COUNT(id) AS count_all FROM charts")->fetch_assoc()['count_all'];

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($data);
}
elseif (isset($_POST['company'], $_POST['title'], $_POST['description'], $_POST['phone'], $_POST['email'], $_POST['link'], $_FILES['display'], $_FILES['file'])) {
	$company = $db->real_escape_string($_POST['company']);
	$title = $db->real_escape_string($_POST['title']);
	$description = $db->real_escape_string($_POST['description']);
	$phone = $db->real_escape_string($_POST['phone']);
	$email = $db->real_escape_string($_POST['email']);
	$link = $db->real_escape_string($_POST['link']);

	$square_image = $_FILES['display']['name'];
	$filename = $_FILES['file']['name'];

	if (move_uploaded_file($_FILES['display']['tmp_name'], "../../uploads/$square_image") && move_uploaded_file($_FILES['file']['tmp_name'], "../../uploads/$filename")) {
		$ins = $db->query("INSERT INTO `adverts`(`id`, `company`, `title`, `description`, `phone`, `email`, `link`, `file`, `status`, `type`, `dateAdded`, `square_image`) VALUES (NULL, '$company', '$title', '$description', '$phone', '$email', '$link', '$filename', 'active', 'daily', '$time', '$square_image')");
		if ($ins) {
			echo json_encode(['status' => true, 'message' => "Success"]);
		}
		else{
			echo json_encode(['status' => false, 'message' => $db->error]);
		}
	}
	else{
		echo json_encode(['status' => false, 'message' => "Failed to upload files"]);
	}
}
elseif (isset($_POST['advert_id'], $_POST['company_edit'], $_POST['title'], $_POST['description'], $_POST['phone'], $_POST['email'], $_POST['link'])) {
	$id = (int)$_POST['advert_id'];
	$company = $db->real_escape_string($_POST['company_edit']);
	$title = $db->real_escape_string($_POST['title']);
	$description = $db->real_escape_string($_POST['description']);
	$phone = $db->real_escape_string($_POST['phone']);
	$email = $db->real_escape_string($_POST['email']);
	$link = $db->real_escape_string($_POST['link']);

	header('Content-Type: application/json; charset=utf-8');
	$upd = $db->query("UPDATE adverts SET company = '$company', title = '$title', description = '$description', phone = '$phone', email = '$email', link = '$link' WHERE id = '$id' ");
	if ($upd) {
		echo json_encode(['status' => true, 'message' => "Success"]);
	}
	else{
		echo json_encode(['status' => false, 'message' => $db->error]);
	}
}
elseif (isset($_FILES['advert_file'], $_POST['advert_id'])) {
	$id = (int)$_POST['advert_id'];

	$filename = $_FILES['advert_file']['name'];

	if (move_uploaded_file($_FILES['advert_file']['tmp_name'], "../../uploads/".$filename)) {
		$db->query("UPDATE adverts SET file = '$filename' WHERE id = '$id' ");
		echo json_encode(['status' => true, 'file' => $filename]);
	}
	else{
		echo json_encode(['status' => false, 'message' => "Failed to upload files"]);
	}
}
elseif (isset($_FILES['advert_picture'], $_POST['advert_id'])) {
	$id = (int)$_POST['advert_id'];

	$filename = $_FILES['advert_picture']['name'];

	if (move_uploaded_file($_FILES['advert_picture']['tmp_name'], "../../uploads/".$filename)) {
		$db->query("UPDATE adverts SET square_image = '$filename' WHERE id = '$id' ");
		echo json_encode(['status' => true, 'image' => $filename]);
	}
	else{
		echo json_encode(['status' => false, 'message' => "Failed to upload files"]);
	}
}
elseif (isset($_POST['artist_name'], $_POST['biography'], $_POST['country'], $_FILES['photo'])) {
	$name = $db->real_escape_string($_POST['artist_name']);
	$biography = $db->real_escape_string($_POST['biography']);
	$country = $db->real_escape_string($_POST['country']);

	$filename = $_FILES['photo']['name'];

	if (move_uploaded_file($_FILES['photo']['tmp_name'], "../../uploads/artists/".$filename)) {
		$ins = $db->query("INSERT INTO `web_artists`(`id`, `webid`, `name`, `photo`, `resampled`, `biography`, `status`, `link`, `website`, `country`, `actions`) VALUES (NULL, '0', '$name', '$filename', '', '$biography', 'active', '', '', '$country', '0')");
		if ($ins) {
			echo json_encode(['status' => true, 'message' => "Success"]);
		}
		else{
			echo json_encode(['status' => false, 'message' => $db->error]);
		}
	}
	else{
		echo json_encode(['status' => false, 'message' => "Failed to upload files"]);
	}
}
elseif (isset($_GET['getArtistSongs'])) {
	$artist_id = (int)trim($_GET['getArtistSongs']);

	$artist_data = $db->query("SELECT * FROM web_artists WHERE id = '$artist_id' ")->fetch_assoc();

	$genres = [];
	$sql = $db->query("SELECT * FROM genre");
	while ($row = $sql->fetch_assoc()) {
		$genres[$row['id']] = $row;
	}

	$genres[0] = ['id' => 0, 'name' => ""];


	$songs = [];
	$read = $db->query("SELECT web_songs.id AS id, web_songs.title AS title, web_songs.resampled_artwork AS artwork, resampled_artwork, web_artists.name AS name, artist, downloads, plays,mp3_url,web_songs.genre FROM web_songs JOIN web_artists ON web_songs.artist = web_artists.id WHERE web_songs.artist = '$artist_id' ");
	while ($row = $read->fetch_assoc()) {
		$song_id = $row['id'];

		$row['genre_data']= $genres[$row['genre']];

		$row['featured'] = "";
		$row['artist_data'] = $artist_data;
        if ($row['artist_data'] != null) {
        	$row['comments'] = $db->query("SELECT * FROM comments WHERE song = '$song_id' ")->num_rows;
	        $row['artist'] = $row['artist_data']['name'];
			array_push($songs, $row);
        }
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($songs);
}
elseif (isset($_POST['newArtist'])) {
	$artist_id = (int)trim($_POST['newArtist']);
	$songs = $db->real_escape_string($_POST['songs']);

	$db->query("UPDATE web_songs SET artist = '$artist_id' WHERE id IN ($songs) ");
	echo "Success";
}
elseif (isset($_POST['song_title'], $_POST['artist_id'], $_POST['genre'], $_FILES['artwork'], $_FILES['file'])) {
	$title = $db->real_escape_string($_POST['song_title']);
	$artist_id = (int)$_POST['artist_id'];
	$genre = (int)$_POST['genre'];

	$artwork = $_FILES['artwork']['name'];
	$mp3_url = $_FILES['file']['name'];

	if (move_uploaded_file($_FILES['artwork']['tmp_name'], "../../artwork/".$artwork) AND move_uploaded_file($_FILES['file']['tmp_name'], "../../songs/".$mp3_url)) {
		$resampled = "../../artwork/".uniqid().".png";
		copy("../../artwork/".$artwork, $resampled);

		$img = new rodzImage($resampled);
		$img->cropImage($resampled);

		$ins = $db->query("INSERT INTO `web_songs`(`id`, `webid`, `title`, `artist`, `album`, `length`, `artwork`, `resampled_artwork`, `mp3_url`, `dateAdded`, `genre`, `website`, `status`, `plays`, `downloads`, `color`, `small_art`, `year`) VALUES (NULL, '0', '$title', '$artist_id', '0', '', '$artwork', '$resampled', '$mp3_url', NOW(), '$genre', '0', 'active', '0', '0', '', '', '2023')");
		if ($ins) {
			echo json_encode(['status' => true, 'message' => "Success"]);
		}
		else{
			echo json_encode(['status' => false, 'message' => $db->error]);
		}
	}
	else{
		echo json_encode(['status' => false, 'message' => "Can't upload files"]);
	}
}
elseif (isset($_POST['song_title'], $_POST['artist_id'], $_POST['genre'], $_FILES['artwork'], $_POST['mp3_url'])) {
	$title = $db->real_escape_string($_POST['song_title']);
	$artist_id = (int)$_POST['artist_id'];
	$genre = (int)$_POST['genre'];

	$artwork = $_FILES['artwork']['name'];
	$mp3_url = $db->real_escape_string($_POST['mp3_url']);

	if (move_uploaded_file($_FILES['artwork']['tmp_name'], "../../artwork/".$artwork)) {
		$filename = uniqid().".png";
		$resampled = "../../artwork/".$filename;
		copy("../../artwork/".$artwork, $resampled);

		$img = new rodzImage($resampled);
		$img->cropImage($resampled);

		$ins = $db->query("INSERT INTO `web_songs`(`id`, `webid`, `title`, `artist`, `album`, `length`, `artwork`, `resampled_artwork`, `mp3_url`, `dateAdded`, `genre`, `website`, `status`, `plays`, `downloads`, `color`, `small_art`, `year`) VALUES (NULL, '0', '$title', '$artist_id', '0', '', '$artwork', '$filename', '$mp3_url', NOW(), '$genre', '0', 'active', '0', '0', '', '', '2023')");
		if ($ins) {
			echo json_encode(['status' => true, 'message' => "Success"]);
		}
		else{
			echo json_encode(['status' => false, 'message' => $db->error]);
		}
	}
	else{
		echo json_encode(['status' => false, 'message' => "Can't upload files"]);
	}
}
elseif (isset($_POST['song_title'], $_POST['artist_id'], $_POST['genre'], $_POST['artwork'], $_POST['mp3_url'])) {
	$title = $db->real_escape_string($_POST['song_title']);
	$artist_id = (int)$_POST['artist_id'];
	$genre = (int)$_POST['genre'];

	$artwork = $_POST['artwork'];
	$mp3_url = $db->real_escape_string($_POST['mp3_url']);

	
	$chars = explode("/", $artwork);
	$filename = $chars[count($chars)-1];
	$resampled = "../../artwork/".$filename;
	file_put_contents($resampled, file_get_contents($artwork));

	//$img = new rodzImage($resampled);
	//$img->cropImage($resampled);

	$ins = $db->query("INSERT INTO `web_songs`(`id`, `webid`, `title`, `artist`, `album`, `length`, `artwork`, `resampled_artwork`, `mp3_url`, `dateAdded`, `genre`, `website`, `status`, `plays`, `downloads`, `color`, `small_art`, `year`) VALUES (NULL, '0', '$title', '$artist_id', '0', '', '$artwork', '$filename', '$mp3_url', NOW(), '$genre', '0', 'active', '0', '0', '', '', '2023')");
	if ($ins) {
		echo json_encode(['status' => true, 'message' => "Success"]);
	}
	else{
		echo json_encode(['status' => false, 'message' => $db->error]);
	}
}
elseif (isset($_FILES['change_artist_picture'], $_POST['artist_id'])) {
	$artist_id = (int)$_POST['artist_id'];

	$filename = $_FILES['change_artist_picture']['name'];

	if (move_uploaded_file($_FILES['change_artist_picture']['tmp_name'], "../../uploads/artists/".$filename)) {
		$filename1 = uniqid().".png";
		$resampled = "../../uploads/artists/".$filename1;
		copy("../../uploads/artists/".$filename, $resampled);

		$img = new rodzImage($resampled);
		$img->cropImage($resampled);

		$db->query("UPDATE web_artists SET photo = '$filename', resampled = '$filename1' WHERE id = '$artist_id' ");
		echo json_encode(['status' => true, 'photo' => $filename1]);
	}
	else{
		echo json_encode(['status' => false, 'message' => "Failed to upload"]);
	}
}
elseif (isset($_POST['artist'], $_POST['album_title'], $_POST['artwork'])) {
	$artist_id = $db->real_escape_string($_POST['artist']);
	$title = $db->real_escape_string($_POST['album_title']);
	$artwork = $db->real_escape_string($_POST['artwork']);

	$ins = $db->query("INSERT INTO `web_albums`(`id`, `name`, `webid`, `link`, `artist`, `image`, `status`, `website`) VALUES (NULL, '$title', '0', '', '$artist_id', '$artwork', 'active', '')");
	if ($ins) {
		echo json_encode(['status' => true, 'message' => "Success"]);
	}
	else{
		echo json_encode(['status' => false, 'message' => "Not enough data"]);
	}
}
elseif (isset($_POST['artist'], $_POST['album_title'], $_FILES['artwork'])) {
	$artist_id = $db->real_escape_string($_POST['artist']);
	$title = $db->real_escape_string($_POST['album_title']);
	$artwork = $_FILES['artwork']['name'];

	if (move_uploaded_file($_FILES['artwork']['tmp_name'], "../../uploads/albums/".$artwork)) {
		$ins = $db->query("INSERT INTO `web_albums`(`id`, `name`, `webid`, `link`, `artist`, `image`, `status`, `website`) VALUES (NULL, '$title', '0', '', '$artist_id', '$artwork', 'active', '')");
		if ($ins) {
			echo json_encode(['status' => true, 'message' => "Success"]);
		}
		else{
			echo json_encode(['status' => false, 'message' => $db->error]);
		}
	}
	else{
		echo json_encode(['status' => false, 'message' => "Failed to upload"]);
	}
}
elseif (isset($_GET['getCategories'])) {
	$data = [];

	$read = $db->query("SELECT * FROM categories ");
	while ($row = $read->fetch_assoc()) {
		//$row['artists'] = (int)$db->query("SELECT COUNT(id) AS count_all FROM web_songs WHERE album = '{$row['id']}' ")->fetch_assoc()['count_all'];
		array_push($data, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($data);
}
elseif (isset($_GET['getCategoryArtist'], $_GET['country'])) {
	$category = (int)trim($_GET['getCategoryArtist']);
	$country = (int)trim($_GET['country']);
	
	$data = [];

	$countries = [];
	$sql = $db->query("SELECT * FROM countries");
	while ($row = $sql->fetch_assoc()) {
		$countries[$row['id']] = $row;
	}

	$countries[0] = ['id' => 0, 'name' => ""];

	$ids = [];
	$read = $db->query("SELECT artist FROM artist_category WHERE category = '$category' ");
	while ($row = $read->fetch_assoc()) {
		array_push($ids, $row['artist']);
	}
	$where = "";
	if (count($ids) > 0) {
		$where = " AND id IN (".implode(",", $ids).") ";
		
		$read = $db->query("SELECT * FROM web_artists WHERE 1 $where ");
		while ($row = $read->fetch_assoc()) {
			//$row['artists'] = (int)$db->query("SELECT COUNT(id) AS count_all FROM web_songs WHERE album = '{$row['id']}' ")->fetch_assoc()['count_all'];
			$row['country_data'] = $countries[$row['country']];
			array_push($data, $row);
		}
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($data);
}
elseif (isset($_POST['addArtistCategory'], $_POST['category'])) {
	$artist_id = (int)$_POST['addArtistCategory'];
	$category = (int)$_POST['category'];

	$check = $db->query("SELECT * FROM artist_category WHERE category = '$category' AND artist = '$artist_id' ");
	if ($check->num_rows > 0) {
		echo "Already added";
	}
	else{
		$ins = $db->query("INSERT INTO `artist_category`(`id`, `category`, `artist`) VALUES (NULL, '$category', '$artist_id')");
		echo "Success";
	}
}
elseif (isset($_POST['new_category'])) {
	$category = $db->real_escape_string($_POST['new_category']);

	$check = $db->query("SELECT * FROM categories WHERE name = '$category' ");
	if ($check->num_rows > 0) {
		echo json_encode(['status' => false, 'message' => "$name is already added"]);
	}
	else{
		$ins = $db->query("INSERT INTO `categories`(`id`, `name`) VALUES (NULL, '$category')");
		if ($ins) {
			echo json_encode(['status' => true, 'message' => "Success!"]);
		}
		else{
			echo json_encode(['status' => false, 'message' => $db->error]);
		}
	}
}
elseif (isset($_GET['get30Data'])) {
	$values = [];
	$labels = [];

	$today = strtotime("today");
	$limit = $time;

	for ($i=0; $i < 31; $i++) { 
		//if ($i == 0) {
			array_push($labels, date('d M Y', $today));
			array_push($values, (int)$db->query("SELECT COUNT(id) AS count_all FROM ip_visits WHERE time BETWEEN '$today' AND '$limit' ")->fetch_assoc()['count_all']);
		//}
		$today -= (3600*24);
		$limit = $today + ((3600*24) - 2);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode(['labels' => array_reverse($labels), 'values' => array_reverse($values)]);
}
elseif (isset($_GET['getListening30Data'])) {
	$values = [];
	$labels = [];

	$today = strtotime("today");
	$limit = $time;

	for ($i=0; $i < 31; $i++) { 
		//if ($i == 0) {
			array_push($labels, date('d M Y', $today));
			array_push($values, (int)$db->query("SELECT COUNT(id) AS count_all FROM song_plays WHERE time BETWEEN '$today' AND '$limit' ")->fetch_assoc()['count_all']);
		//}
		$today -= (3600*24);
		$limit = $today + ((3600*24) - 2);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode(['labels' => array_reverse($labels), 'values' => array_reverse($values)]);
}
elseif (isset($_GET['get7Data'])) {
	$values = [];
	$labels = [];

	$today = strtotime("today");
	$limit = $time;

	for ($i=0; $i < 7; $i++) { 
		//if ($i == 0) {
			array_push($labels, date('d M Y', $today));
			array_push($values, (int)$db->query("SELECT COUNT(id) AS count_all FROM ip_visits WHERE time BETWEEN '$today' AND '$limit' ")->fetch_assoc()['count_all']);
		//}
		$today -= (3600*24);
		$limit = $today + ((3600*24) - 2);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode(['labels' => array_reverse($labels), 'values' => array_reverse($values)]);
}
elseif (isset($_FILES['change_picture'])) {
	$filename = $_FILES['change_picture']['name'];

	if (move_uploaded_file($_FILES['change_picture']['tmp_name'], "../../uploads/".$filename)) {
		$user_id = $_SESSION['user_id'];

		$db->query("UPDATE admins SET photo = '$filename' WHERE id = '$user_id' ");
		$_SESSION['data']['photo'] = $filename;
		$_SESSION['data']['status'] = true;
		echo json_encode($_SESSION['data']);
	}
	else{
		echo json_encode(['status' => false, 'message' => "Cannot upload file"]);
	}
}
elseif (isset($_POST['admin_name'], $_POST['admin_email'])) {
	$name = $db->real_escape_string($_POST['admin_name']);
	$email = $db->real_escape_string($_POST['admin_email']);

	header('Content-Type: application/json; charset=utf-8');
	$check = $db->query("SELECT * FROM admins WHERE email = '$email' ");
	if ($check->num_rows == 0) {
		// code...
		$ins = $db->query("INSERT INTO `admins`(`id`, `name`, `email`, `password`, `photo`, `status`) VALUES (NULL, '$name', '$email', MD5('1234'), 'pro_file.png', 'active')");
		if ($ins) {
			echo json_encode(['status' => true]);
		}
		else{
			echo json_encode(['status' => false, 'message' => $db->error]);
		}
	}
	else{
		echo json_encode(['status' => false, 'message' => "$email is already registered"]);
	}
}
elseif (isset($_POST['admin_new_password'])) {
	$user_id = $_SESSION['user_id'];

	$pass = md5($_POST['admin_new_password']);

	$db->query("UPDATE admins SET password = '$pass' WHERE id = '$user_id' ");
	header('Content-Type: application/json; charset=utf-8');
	echo json_encode(['status' => true]);
}
elseif (isset($_POST['updateEmail'])) {
	$user_id = $_SESSION['user_id'];

	$email = $db->real_escape_string($_POST['updateEmail']);

	$db->query("UPDATE admins SET email = '$email' WHERE id = '$user_id' ");
	header('Content-Type: application/json; charset=utf-8');
	echo json_encode(['status' => true]);
}
elseif (isset($_POST['updateName'])) {
	$user_id = $_SESSION['user_id'];

	$name = $db->real_escape_string($_POST['updateName']);

	$db->query("UPDATE admins SET name = '$name' WHERE id = '$user_id' ");
	header('Content-Type: application/json; charset=utf-8');
	echo json_encode(['status' => true]);
}
elseif (isset($_POST['artist_id'],$_POST['img_link'])) {
	$url = $_POST['img_link'];
	$artist_id = (int)$_POST['artist_id'];


	$ch = curl_init();
	$headers = [];
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

	// this function is called by curl for each header received
	curl_setopt($ch, CURLOPT_HEADERFUNCTION,
		function($curl, $header) use (&$headers)
		{
			$len = strlen($header);
			$header = explode(':', $header, 2);
			if (count($header) < 2){ // ignore invalid headers
				return $len;
			}

			$headers[strtolower(trim($header[0]))][] = trim($header[1]);

			return $len;
		}
	);
	$data = curl_exec($ch);

	$isImage = false;
	$filename = '';
	if (isset($headers['content-type'])) {
		$contentType = $headers['content-type'][0];

		if (Strings::contains($contentType, "image/")) {
			$chars = explode("/", $contentType);
			$filename = uniqid().".".$chars[1];
			file_put_contents("../../uploads/artists/$filename",$data);
			$isImage = true;
		}
	}

	if ($isImage) {
		//make the thumbnnail
		$resampled = Crypto::letters(32).".png";
		$img = new rodzImage("../../uploads/artists/$filename");
		$img->cropImage("../../uploads/artists/$resampled");
		
		$db->query("UPDATE web_artists SET photo = '$filename', resampled = '$resampled' WHERE id = '$artist_id' ");
		echo json_encode(['status' => true, 'filename' => $filename]);
	}
	else{
		echo json_encode(['status' => false, 'message' => "Image not found!"]);
	}
}
elseif (isset($_POST['set_genre_songs'], $_POST['genre'])) {
	$ids = $_POST['set_genre_songs'];
	$genre = (int)$_POST['genre'];

	$db->query("UPDATE web_songs SET genre = '$genre' WHERE id IN ($ids) ");
	echo json_encode(['status' => true]);
}
elseif (isset($_FILES['uploadArtwork'], $_POST['song_id'])) {
	$id = (int)$_POST['song_id'];
	$filename = $_FILES['uploadArtwork']['name'];

	if (move_uploaded_file($_FILES['uploadArtwork']['tmp_name'], "../../artwork/".$filename)) {
		$data = $db->query("SELECT * FROM web_songs WHERE id = '$id' ")->fetch_assoc();
		if (!Strings::contains($data['artwork'], "http")) {
			if (file_exists("../../artwork/".$data['artwork'])) {
				unlink("../../artwork/".$data['artwork']);
			}
		}
		if (file_exists("../../artwork/".$data['resampled_artwork'])) {
			unlink("../../artwork/".$data['resampled_artwork']);
		}

		$resampled = uniqid().".png";
		copy("../../artwork/".$filename, "../../artwork/".$resampled);
		$img = new rodzImage("../../artwork/".$resampled);
		$img->cropImage("../../artwork/".$resampled);

		$db->query("UPDATE web_songs SET artwork = '$filename', resampled_artwork = '$resampled' WHERE id = '$id' ");
		echo json_encode(['status' => true, 'filename' => $resampled]);
	}
	else{
		echo json_encode(['status' => false, 'message' => "Failed to upload file"]);
	}
}
elseif (isset($_POST['update_web_artwork'], $_POST['web_link'])) {
	$id = (int)$_POST['update_web_artwork'];
	$url = $_POST['web_link'];

	$ch = curl_init();
	$headers = [];
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

	// this function is called by curl for each header received
	curl_setopt($ch, CURLOPT_HEADERFUNCTION,
		function($curl, $header) use (&$headers)
		{
			$len = strlen($header);
			$header = explode(':', $header, 2);
			if (count($header) < 2){ // ignore invalid headers
				return $len;
			}

			$headers[strtolower(trim($header[0]))][] = trim($header[1]);

			return $len;
		}
	);
	$data = curl_exec($ch);

	$isImage = false;
	$filename = '';
	if (isset($headers['content-type'])) {
		$contentType = $headers['content-type'][0];

		if (Strings::contains($contentType, "image/")) {
			$chars = explode("/", $contentType);
			$filename = uniqid().".".$chars[1];
			file_put_contents("../../artwork/$filename",$data);
			$isImage = true;
		}
	}

	if ($isImage) {
		$resampled = uniqid().".png";
		copy("../../artwork/".$filename, "../../artwork/".$resampled);
		$img = new rodzImage("../../artwork/".$resampled);
		$img->cropImage("../../artwork/".$resampled);

		$db->query("UPDATE web_songs SET artwork = '$filename', resampled_artwork = '$resampled' WHERE id = '$id' ");
		echo json_encode(['status' => true, 'filename' => $resampled]);
	}
	else{
		echo json_encode(['status' => false, 'message' => "Image not found!"]);
	}
}
elseif (isset($_POST['song_id'], $_POST['song_title_edit'], $_POST['year'], $_POST['genre'], $_POST['mp3_url'])) {
	$song_id = (int)$_POST['song_id'];
	$title = $db->real_escape_string($_POST['song_title_edit']);
	$year = (int)$_POST['year'];
	$genre = (int)$_POST['genre'];
	$mp3_url = $db->real_escape_string($_POST['mp3_url']);

	$db->query("UPDATE web_songs SET title = '$title', year = '$year', genre = '$genre', mp3_url = '$mp3_url' WHERE id = '$song_id' ");
	echo json_encode(['status' => true, 'message' => "Success"]);
}
elseif (isset($_POST['genre_id'], $_POST['update_genre'])) {
	$id = (int)$_POST['genre_id'];
	$name = $db->real_escape_string($_POST['update_genre']);

	$db->query("UPDATE genre SET name = '$name' WHERE id = '$id' ");
	echo "Updated!";
}
elseif (isset($_POST['heatArtist'])) {
	$id = (int)$_POST['heatArtist'];

	$db->query("UPDATE web_artists SET actions = actions + 100 WHERE id = '$id' ");
	echo "Success";;
}
elseif (isset($_POST['heatSong'])) {
	$id = (int)$_POST['heatSong'];

	$db->query("UPDATE web_songs SET plays = plays + 100 WHERE id = '$id' ");
	echo "Success";;
}
elseif (isset($_POST['saveSongGenre'], $_POST['genre'])) {
	$song = (int)$_POST['saveSongGenre'];
	$genre = (int)$_POST['genre'];

	$db->query("UPDATE web_songs SET genre = '$genre' WHERE id = '$song' ");
}
elseif (isset($_POST['category_id'], $_POST['category_edit'])) {
	$category_id = (int)$_POST['category_id'];
	$name = $db->real_escape_string($_POST['category_edit']);

	$upd = $db->query("UPDATE categories SET name = '$name' WHERE id = '$category_id' ");
	//echo json_encode(['status' => true]);
	echo "Success";
}
elseif (isset($_POST['genres_to_merge'], $_POST['new_name'])) {
	$ids = explode(",", $_POST['genres_to_merge']);

	$name = $db->real_escape_string($_POST['new_name']);

	$keep = $ids[0];
	$remaining = array_slice($ids, 1);

	if (count($remaining) > 0) {
		$str = implode(",", $remaining);
		$db->query("UPDATE web_songs SET genre = '$keep' WHERE genre IN ($str) ");
		$db->query("UPDATE genre SET name = '$name' WHERE id = '$keep' ");
		$db->query("DELETE FROM genre WHERE id IN ($str) ");
	}

	echo json_encode(['status' => true, 'message' => "Success"]);
}
elseif (isset($_POST['deleteGenre'])) {
	$id = $_POST['deleteGenre'];

	$db->query("UPDATE web_songs SET genre = '0' WHERE genre = '$id' ");
	$db->query("DELETE FROM genre WHERE id = '$id' ");
	echo "Genre deleted";
}
elseif (isset($_POST['markRelated'])) {
	$nums = explode(",", $_POST['markRelated']);

	$greetings = [];

	for ($i=0; $i < count($nums); $i++) { 
		$min = array_slice($nums, $i+1);
		for ($j=0; $j < count($min); $j++) { 
			array_push($greetings, ['num1'=>$nums[$i], 'num2' => $min[$j]]);
		}
	}

	$queries = [];
	foreach ($greetings as $col) {
		$read = $db->query("SELECT * FROM genre_relations WHERE genre1 = '{$col['num1']}' AND genre2 = '{$col['num2']}' OR genre1 = '{$col['num2']}' AND genre2 = '{$col['num1']}' ");
		if ($read->num_rows == 0) {
			array_push($queries, "INSERT INTO `genre_relations`(`genre1`, `genre2`) VALUES ('{$col['num1']}', '{$col['num2']}')");
		}
	}

	if (count($queries)) {
		$db->multi_query(implode("; ", $queries));
	}
	echo "Saved genre relations";
}
elseif (isset($_GET['getEmails'])) {
	$data = [];

	$read = $db->query("SELECT DISTINCT receiver FROM emails ORDER BY id DESC ");
	while ($row = $read->fetch_assoc()) {
		array_push($data, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($data);
}

elseif (isset($_GET['getEmailHeads'])) {
	$email = $db->real_escape_string($_GET['getEmailHeads']);

	$data = [];

	$read = $db->query("SELECT * FROM emails WHERE receiver = '$email' ORDER BY id DESC ");
	while ($row = $read->fetch_assoc()) {
		$row['text'] = strip_tags($row['content']);
		$row['text'] = Strings::words(Strings::trim($row['text'], 5), 20);
		array_push($data, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($data);
}
else{
	echo json_encode(['status' => false, 'message' => "Not enough data", ...$_POST]);
}