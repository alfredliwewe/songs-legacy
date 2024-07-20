<?php
require "../db.php";
require "../functions.php";
require "functions.php";

if (isset($_GET['getCharts'])) {
    $groups = [];

	$read = $db->query("SELECT * FROM chart_groups");
	while ($row = $read->fetch_assoc()) {
		$groups[$row['id']] = $row['name'];
	}

	$charts = [];
	$sql = $db->query("SELECT * FROM charts ORDER BY actions DESC LIMIT 4");
	while ($row = $sql->fetch_assoc()) {
		$row['group'] = $groups[$row['parent']];

		$songs = [];
		$read1 = $db->query("SELECT web_songs.id,web_songs.title, mp3_url, artwork, artist, resampled_artwork, name FROM chart_list JOIN web_songs ON chart_list.song = web_songs.id JOIN web_artists ON web_songs.artist = web_artists.id WHERE chart = '{$row['id']}' ");
		while ($row1 = $read1->fetch_assoc()) {
			array_push($songs, $row1);
		}
		$row['songs'] = $songs;
		array_push($charts, $row);
	}

	echo json_encode($charts);
}
elseif (isset($_GET['monthly']) OR isset($_POST['monthly'])) {
	$last = time();

	$start = $last - (30 * 24 * 3600);

	$songs = [];
	$read= $db->query("SELECT * FROM song_plays WHERE `time` BETWEEN '$start' AND '$last' ");
	while ($row = $read->fetch_assoc()) {
		if (isset($songs[$row['song']])) {
			$songs[$row['song']] += 1;
		}
		else{
			$songs[$row['song']] = 1;
		}
	}

	arsort($songs);

	$data = [];

	$i = 0;
	foreach ($songs as $key => $value) {
		if ($i < 20) {
			$row = $db->query("SELECT * FROM web_songs WHERE id = '$key' ")->fetch_assoc();
			$row['artist_data'] = $db->query("SELECT * FROM web_artists WHERE id = '{$row['artist']}' ")->fetch_assoc();
			array_push($data, $row);
		}
		$i += 1;
	}

	echo json_encode($data);
}
elseif (isset($_GET['getProductsHome']) OR isset($_POST['getProductsHome'])) {
	if (isset($_POST['user'])) {
		$user = $_POST['user'];
	}
	else{
		$user = $_GET['user'];
	}
	//get music and categories
	$read = $db->query("SELECT DISTINCT genre FROM `web_songs` WHERE website != 'mdundo' ");
	$genres = [];
	while ($row = $read->fetch_assoc()) {
		$genres[$row['genre']] = 0;
	}
	//read songs played
	$sql = $db->query("SELECT genre FROM song_plays JOIN web_songs ON song_plays.song = web_songs.id WHERE song_plays.user = '$user' ");
	while($row = $sql->fetch_assoc()){
		if (isset($genres[$row['genre']])) {
			$genres[$row['genre']] += 1;
		}
	}
	arsort($genres);

	$mega = [];

	$count = 0;
	foreach ($genres as $key => $value){
		if ($count < 7) {
			
			$genre = $key;
			$data = [];
			$data['label'] = $genre;
			$data['id'] = $genre;

			$products = [];
			$sql = $db->query("SELECT *,web_songs.id AS song_id FROM web_songs WHERE genre = '$genre' ORDER BY plays DESC LIMIT 0,10");
			while ($row = $sql->fetch_assoc()) {
				$song_id = $row['song_id'];
				$row['unik'] = rand(10001,99999);
		        $row['downloads'] = get_download($song_id);
		        $row['rating'] = strip_tags(get_rating($song_id));
		        $row['featured'] = "";
		        $row['artist_data'] = $db->query("SELECT * FROM web_artists WHERE id = '{$row['artist']}' ")->fetch_assoc();
		        if ($row['artist_data'] != null) {
		        	$row['comments'] = $db->query("SELECT * FROM comments WHERE song = '$song_id' ")->num_rows;
			        $row['artist'] = $row['artist_data']['name'];
					array_push($products, $row);
		        }
			}

			$data['products'] = $products;
			if (count($products) > 1) {
				array_push($mega, $data);
			}
		}

		$count += 1;
	}

	$adverts = [];
	$read1 = $db->query("SELECT * FROM adverts");
	while ($row = $read1->fetch_assoc()) {
		array_push($adverts, $row);
	}

	echo json_encode(['mega' => $mega, 'adverts' => $adverts]);
}
elseif (isset($_POST['getRelated'], $_POST['type'])) {
	$song_id = $_POST['getRelated'];

	//getting song tags
	$tags = [];
	$s = $db->query("SELECT * FROM tag_song WHERE song = '$song_id' ");
	while ($row = $s->fetch_assoc()) {
		array_push($tags, $row['tag']);
	}

	$data = [];

	$songs = [];

	foreach ($tags as $tag) {
		$read = $db->query("SELECT web_songs.id AS id, web_songs.title AS title, web_songs.resampled_artwork AS artwork, resampled_artwork, web_artists.name AS name, artist, downloads, plays, mp3_url,song FROM tag_song JOIN web_songs ON tag_song.song = web_songs.id JOIN web_artists ON web_songs.artist = web_artists.id WHERE tag = '$tag' ORDER BY plays DESC LIMIT 5 ");

		while ($row = $read->fetch_assoc()) {
			if (!isset($songs[$row['song']])) {
				$song_id = $row['id'];

				$tags = [];
				$read11 = $db->query("SELECT * FROM tag_song JOIN tags ON tag_song.tag = tags.id WHERE song = '$song_id' ");
				while($row1 = $read11->fetch_assoc()){
					array_push($tags, $row1);
				}
				$row['tags'] = $tags;

				$row['featured'] = "";
				$row['artist_data'] = $db->query("SELECT * FROM web_artists WHERE id = '{$row['artist']}' ")->fetch_assoc();
			    if ($row['artist_data'] != null) {
			    	$row['comments'] = $db->query("SELECT * FROM comments WHERE song = '$song_id' ")->num_rows;
			        $row['artist'] = $row['artist_data']['name'];
					array_push($data, $row);
			    }

				$songs[$row['song']] = $row;
			}
		}
	}
	
	shuffle($data);

	echo json_encode($data);
}
elseif (isset($_GET['getArtistFromSong'])) {
	$song_id = (int)trim($_GET['getArtistFromSong']);
	$artist_id = $db->query("SELECT artist FROM web_songs WHERE id = '$song_id' ")->fetch_assoc()['artist'];

	echo json_encode($db->query("SELECT * FROM web_artists WHERE id = '$artist_id' ")->fetch_assoc());
}
elseif (isset($_GET['getAllSongs'])) {
	$artist_id = (int)trim($_GET['getAllSongs']);

	$songs = [];
	$read = $db->query("SELECT web_songs.id AS id, web_songs.title AS title, web_songs.resampled_artwork AS artwork, resampled_artwork, web_artists.name AS name, artist, downloads, plays FROM web_songs JOIN web_artists ON web_songs.artist = web_artists.id WHERE web_songs.artist = '$artist_id' ");
	while ($row = $read->fetch_assoc()) {
		$song_id = $row['id'];

		$row['featured'] = "";
		$row['artist_data'] = $db->query("SELECT * FROM web_artists WHERE id = '{$row['artist']}' ")->fetch_assoc();
        if ($row['artist_data'] != null) {
        	$row['comments'] = $db->query("SELECT * FROM comments WHERE song = '$song_id' ")->num_rows;
	        $row['artist'] = $row['artist_data']['name'];
			array_push($songs, $row);
        }
	}

	echo json_encode($songs);
}
elseif (isset($_POST['getComments'], $_POST['page'])) {
	$song_id = (int)trim($_POST['getComments']);
	$page = (int)trim($_POST['page']);

	$start = ($page - 1) * 10;
	$fin = $page * 10;

	$comments = [];

	$read = $db->query("SELECT * FROM comments WHERE song = '$song_id' AND parent = '0' ORDER BY id DESC LIMIT $start, $fin");
	while ($row = $read->fetch_assoc()) {
		$row['user_data'] = $db->query("SELECT * FROM users WHERE id = '{$row['user']}' ")->fetch_assoc();
		$row['user_name'] = $row['user_data']['name'];
		$row['comment'] = nl2br($row['comment']);
		$row['time'] = time_ago($row['time']);
		$replies = [];
		$sql = $db->query("SELECT * FROM comments WHERE parent = '{$row['id']}' ");
		while ($row1 = $sql->fetch_assoc()) {
			$row1['user_data'] = $db->query("SELECT * FROM users WHERE id = '{$row1['user']}' ")->fetch_assoc();
			$row1['user_name'] = $row1['user_data']['name'];
			$row['time'] = time_ago($row['time']);
			array_push($replies, $row1);
		}
		$row['replies'] = $replies;
		array_push($comments, $row);
	}

	
	echo json_encode($comments);
}
elseif (isset($_POST['sendComment'], $_POST['song'])) {
	$user = 1;
	$comment = $db->real_escape_string(str_replace("<br>", "\n", $_POST['sendComment']));
	$song = (int)trim($_POST['song']);
	$time = time();

	$ins = $db->query("INSERT INTO `comments`(`id`, `song`, `user`, `parent`, `comment`, `time`, `rating`) VALUES (NULL, '$song', '$user', '0', '$comment', '$time', '0.0')");
	if ($ins) {
		$comment_id = $db->insert_id;

		$read = $db->query("SELECT * FROM comments WHERE id = '$comment_id' ");
		$row = $read->fetch_assoc();
		$row['user_data'] = $db->query("SELECT * FROM users WHERE id = '{$row['user']}' ")->fetch_assoc();
		$row['user_name'] = $row['user_data']['name'];
		$row['comment'] = nl2br($row['comment']);
		$row['time'] = time_ago($row['time']);
		$replies = [];
		$sql = $db->query("SELECT * FROM comments WHERE parent = '{$row['id']}' ");
		while ($row1 = $sql->fetch_assoc()) {
			$row1['user_data'] = $db->query("SELECT * FROM users WHERE id = '{$row1['user']}' ")->fetch_assoc();
			$row1['user_name'] = $row1['user_data']['name'];
			array_push($replies, $row1);
		}
		$row['replies'] = $replies;
		

		echo json_encode(['status' => true, 'comment' => $row]);
		
	}
	else{
		echo json_encode(['status' => false, 'message' => $db->error]);
	}
}
elseif (isset($_GET['setTheme'])) {
	setcookie("theme", $_GET['setTheme'], time()+ (3600*24*30));
	echo "true";
}
elseif (isset($_GET['searchModal'])) {
	$search = $db->real_escape_string($_GET['searchModal']);

	$data = [];
	$read = $db->query("SELECT * FROM web_songs WHERE title LIKE '%{$search}%' LIMIT 20");
	while ($row = $read->fetch_assoc()) {
		$row['type'] = 'local';
		$row['song_id'] = $row['id'];
		array_push($data, $row);
	}

	$read = $db->query("SELECT web_songs.id AS song_id,title,name FROM web_songs JOIN web_artists ON web_songs.artist = web_artists.id WHERE name LIKE '%{$search}%' LIMIT 60");
	while ($row = $read->fetch_assoc()) {
		$row['type'] = 'malawi';
		array_push($data, $row);
	}

	echo json_encode($data);
}
elseif (isset($_POST['phone_login'], $_POST['password'])) {
	$phone = $db->real_escape_string($_POST['phone_login']);
	$password = md5($_POST['password']);

	$read = $db->query("SELECT * FROM users WHERE phone = '$phone' AND password = '$password' OR email = '$phone' AND password = '$password' ");
	if ($read->num_rows > 0) {
		$data = $read->fetch_assoc();
		$_SESSION['user'] = $data;
		$_SESSION['data'] = $data;
		$_SESSION['has_logged_in'] = $data['id'];
		$_SESSION['user_id'] = $data['id'];

		setcookie('logged_user_id', $data['id'], time()+(3600 * 24 * 30));
		echo json_encode(['status' => true]);
	}
	else{
		echo json_encode(['status' => false, 'message' => 'Phone and password are incorrect']);
	}
}
elseif (isset($_POST['comment_id'], $_POST['text_reply'], $_SESSION['user'])) {
	$comment_id = $_POST['comment_id'];
	$text = $db->real_escape_string($_POST['text_reply']);
	$user = $_SESSION['user_id'];
	$song = (int)trim($_POST['song']);
	$time = time();
	$rating = $db->query("SELECT * FROM comments WHERE id = '$comment_id' ")->fetch_assoc()['rating'];

	$ins = $db->query("INSERT INTO `comments`(`id`, `song`, `user`, `parent`, `comment`, `time`, `rating`) VALUES (NULL, '$song', '$user', '$comment_id', '$text', '$time', '$rating')");
	if ($ins) {
		echo json_encode(['status' => true, 'message' => "Comment was sent"]);
	}
	else{
		echo json_encode(['status' => false, 'message' => $db->error]);
	}
}
else{
	echo "No data";
	var_dump($_POST);
}