<?php

require '../db.php';
require '../includes/String.php';

$path = $_GET['path'];

switch ($path) {
	case 'artists':
		if (isset($_POST['name'])) {
			$name = $db->real_escape_string($_POST['name']);

			//get optional data
			$country = isset($_POST['country']) ? $db->real_escape_string($_POST['country']) : "";
			$photo = isset($_POST['photo']) ? $db->real_escape_string($_POST['photo']) : "";
			$biography = isset($_POST['biography']) ? $db->real_escape_string($_POST['biography']) : "";
			$link = isset($_POST['link']) ? $db->real_escape_string($_POST['link']) : "";
			$website = isset($_POST['website']) ? $db->real_escape_string($_POST['website']) : "";

			$read = $db->query("SELECT * FROM web_artists WHERE name LIKE '$name' ");
			if ($read->num_rows > 0) {
				// already added...
				echo json_encode(['status' => false, 'message' => "already added"]);
			}
			else{
				//save

				//check country
				$country_id = 0;
				if ($country != "") {
					$sql = $db->query("SELECT * FROM countries WHERE name = '$country'");
					if ($sql->num_rows > 0) {
						$country_id = $sql->fetch_assoc()['id'];
					}
				}

				$ins = $db->query("INSERT INTO `web_artists`(`id`, `webid`, `name`, `photo`, `resampled`, `biography`, `status`, `link`, `website`, `country`) VALUES (NULL, '0', '$name', '$photo', '', '', '$biography', 'active', '$link', '$website', '$country_id')");
				echo json_encode(['status' => true, 'message' => "Added"]);
			}
		}
		else{
			echo json_encode(['status' => false, 'message' => "Not enough data"]);
		}
		break;

	case 'songs':
		if (isset($_POST['artist'], $_POST['title'], $_POST['mp3_url'])) {
			$artist_name = $db->real_escape_string($_POST['artist']);
			$title = $db->real_escape_string($_POST['title']);
			$mp3_url = $db->real_escape_string($_POST['mp3_url']);

			//optional data
			$artwork = isset($_POST['artwork']) ? $db->real_escape_string($_POST['artwork']) : "icon.png";
			$duration = isset($_POST['duration']) ? $db->real_escape_string($_POST['duration']) : "";
			$date_added = isset($_POST['date_added']) ? $db->real_escape_string($_POST['date_added']) : time();
			$genre = isset($_POST['genre']) ? $db->real_escape_string($_POST['genre']) : "";
			$year = isset($_POST['year']) ? $db->real_escape_string($_POST['year']) : "";
			$website = isset($_POST['website']) ? $db->real_escape_string($_POST['website']) : "";
			$country = isset($_POST['country']) ? $db->real_escape_string($_POST['country']) : "";

			$genre_id = 0;
			if ($genre != "") {
				$sql = $db->query("SELECT * FROM genre WHERE name LIKE '$genre' ");
				if ($sql->num_rows > 0) {
					$genre_id = $sql->fetch_assoc()['id'];
				}
				else{
					$ins = $db->query("INSERT INTO `genre`(`id`, `name`, `status`) VALUES (NULL, '$genre','active')");
					$genre_id = $db->insert_id;
				}
			}

			//check country
			$country_id = 0;
			if ($country != "") {
				$sql = $db->query("SELECT * FROM countries WHERE name = '$country'");
				if ($sql->num_rows > 0) {
					$country_id = $sql->fetch_assoc()['id'];
				}
			}

			//check if there are more artists
			$names = Strings::multipleSplit($artist_name, [",", "&", "x", "X", "and", "feat", "feat.", "ft", "ft.", "featuring"]);
			$artist_name = $names[0];

			//check the artist
			$artist_id = 0;

			$check = $db->query("SELECT * FROM web_artists WHERE name LIKE '$artist_name' ");
			if ($check->num_rows > 0) {
				$artist_id = $check->fetch_assoc()['id'];
			}
			else{
				//save artist
				$artist_name = Strings::fixName($artist_name);
				$ins = $db->query("INSERT INTO `web_artists`(`id`, `webid`, `name`, `photo`, `resampled`, `biography`, `status`, `link`, `website`, `country`) VALUES (NULL, '0', '$artist_name', '', '', '', 'active', '', '$website', '$country_id')");
				if ($ins) {
					$artist_id = $db->insert_id;
				}
			}
			//check  the song
			$check= $db->query("SELECT * FROM web_songs WHERE title = '$title' AND artist= '$artist_id' ");
			if ($check->num_rows > 0) {
				echo json_encode(['status' => false, 'message' => "Already added"]);
			}
			else{
				//save the song
				$ins2 = $db->query("INSERT INTO `web_songs`(`id`, `webid`, `title`, `artist`, `album`, `length`, `artwork`, `resampled_artwork`, `mp3_url`, `dateAdded`, `genre`, `website`, `status`, `plays`, `downloads`, `color`, `small_art`, `year`) VALUES (NULL, '0', '$title', '$artist_id', '0', '$duration', '$artwork', '', '$mp3_url', '$date_added', '$genre_id','$website', 'active', '0', '0', '', '', '$year')");
				$song_id = $db->insert_id;
				//save supporting artists
				if (count($names) > 1) {
					$ids = [];
					for ($i=1; $i < count($names); $i++) { 
						$artist_name = Strings::fixName($names[$i]);
						$check = $db->query("SELECT * FROM web_artists WHERE name LIKE '$artist_name' ");
						if ($check->num_rows > 0) {
							$artist_id = $check->fetch_assoc()['id'];
							array_push($ids, "(NULL, '$song_id', '$artist_id')");
						}
						else{
							//save artist
							$ins = $db->query("INSERT INTO `web_artists`(`id`, `webid`, `name`, `photo`, `resampled`, `biography`, `status`, `link`, `website`, `country`) VALUES (NULL, '0', '$artist_name', '', '', '', 'active', '', '$website', '$country_id')");
							if ($ins) {
								$artist_id = $db->insert_id;
								array_push($ids, "(NULL, '$song_id', '$artist_id')");
							}
						}
					}

					//save contributing artists
					$db->query("INSERT INTO `contributing`(`id`, `song`, `artist`) VALUES ".implode(", ", $ids));
				}
				echo json_encode(['status' => true, 'message' => "Added", 'song' => $title]);
			}
		}
		else{
			//find the missing keys
			$allowed = ["artist", "title", "mp3_url"];
			$missing = [];
			foreach ($allowed as $key) {
				if(!isset($_POST[$key])){
					array_push($missing, $key);
				}
			}
			echo json_encode(['status' => false, 'message' => "Not enough information (".implode(",",$missing).")"]);
		}
		break;

	case 'artistAndSongs':
		$post = json_decode(file_get_contents('php://input'), true);
		//file_put_contents('hello.json', json_encode($post));
		//echo "hello";
		if (isset($post['name'])) {
			$name = $db->real_escape_string($post['name']);

			$artist_id = 0;

			if (count($post['songs']) > 0) {
				//get optional data
				$country = isset($post['country']) ? $db->real_escape_string($post['country']) : "";
				$photo = isset($post['photo']) ? $db->real_escape_string($post['photo']) : "";
				$biography = isset($post['biography']) ? $db->real_escape_string($post['biography']) : "";
				$link = isset($post['link']) ? $db->real_escape_string($post['link']) : "";
				$website = isset($post['website']) ? $db->real_escape_string($post['website']) : "";

				$read = $db->query("SELECT * FROM web_artists WHERE name LIKE '$name' ");
				if ($read->num_rows > 0) {
					// already added...
					$artist_id = $read->fetch_assoc()['id'];
				}
				else{
					//save

					//check country
					$country_id = 0;
					if ($country != "") {
						$sql = $db->query("SELECT * FROM countries WHERE name = '$country'");
						if ($sql->num_rows > 0) {
							$country_id = $sql->fetch_assoc()['id'];
						}
					}

					$ins = $db->query("INSERT INTO `web_artists`(`id`, `webid`, `name`, `photo`, `resampled`, `biography`, `status`, `link`, `website`, `country`) VALUES (NULL, '0', '$name', '$photo', '', '$biography', 'active', '$link', '$website', '$country_id')");
					//echo json_encode(['status' => true, 'message' => "Added"]);
					$artist_id = $db->insert_id;
				}


				//now save the songs
				$added = [];
				$already = [];

				foreach ($post['songs'] as $SONG) {
					if (isset($SONG['title'], $SONG['mp3_url'])) {
						//$artist_name = $db->real_escape_string($_POST['artist']);
						$title = $db->real_escape_string($SONG['title']);
						$mp3_url = $db->real_escape_string($SONG['mp3_url']);

						//optional data
						$artwork = isset($SONG['artwork']) ? $db->real_escape_string($SONG['artwork']) : "icon.png";
						$duration = isset($SONG['duration']) ? $db->real_escape_string($SONG['duration']) : "";
						$date_added = isset($SONG['date_added']) ? $db->real_escape_string($SONG['date_added']) : time();
						$genre = isset($SONG['genre']) ? $db->real_escape_string($SONG['genre']) : "";
						$year = isset($SONG['year']) ? $db->real_escape_string($SONG['year']) : "";
						$website = isset($SONG['website']) ? $db->real_escape_string($SONG['website']) : "";
						$webid = isset($SONG['webid']) ? $db->real_escape_string($SONG['webid']) : "0";
						//$country = isset($SONG['country']) ? $db->real_escape_string($SONG['country']) : "";

						$genre_id = 0;
						if ($genre != "") {
							$sql = $db->query("SELECT * FROM genre WHERE name LIKE '$genre' ");
							if ($sql->num_rows > 0) {
								$genre_id = $sql->fetch_assoc()['id'];
							}
							else{
								$ins = $db->query("INSERT INTO `genre`(`id`, `name`, `status`) VALUES (NULL, '$genre','active')");
								$genre_id = $db->insert_id;
							}
						}
						
						//check  the song
						$check= $db->query("SELECT * FROM web_songs WHERE title = '$title' AND artist= '$artist_id' ");
						if ($check->num_rows > 0) {
							//echo json_encode(['status' => false, 'message' => "Already added"]);
							array_push($already, $title);
						}
						else{
							//save the song
							$ins2 = $db->query("INSERT INTO `web_songs`(`id`, `webid`, `title`, `artist`, `album`, `length`, `artwork`, `resampled_artwork`, `mp3_url`, `dateAdded`, `genre`, `website`, `status`, `plays`, `downloads`, `color`, `small_art`, `year`) VALUES (NULL, '$webid', '$title', '$artist_id', '0', '$duration', '$artwork', '', '$mp3_url', '$date_added', '$genre_id','$website', 'active', '0', '0', '', '', '$year')");
							$song_id = $db->insert_id;
							//save supporting artists
							//echo json_encode(['status' => true, 'message' => "Added", 'song' => $title]);
							array_push($added, $title);
						}
					}
				}

				echo json_encode(['status' => true, 'message' => "Success", 'added' => $added, 'already' => $already]);
			}
			else{
				echo json_encode(['status' => false, 'message' => "Artist '$name' has 0 songs"]);;
			}
		}
		else{
			echo json_encode(['status' => false, 'message' => "Missing 'name' key **required"]);
		}
		break;

	case 'uploadSong':
		if (isset($_FILES['music'], $_POST['title'], $_POST['artist'])) {
			$filename = uniqid().".mp3";

			if (move_uploaded_file($_FILES['music']['tmp_name'], "../songs/".$filename)) {
				$artist_name = $db->real_escape_string($_POST['artist']);
				$title = $db->real_escape_string($_POST['title']);
				$mp3_url = $filename;

				//optional data
				$artwork = isset($_POST['artwork']) ? $db->real_escape_string($_POST['artwork']) : "icon.png";
				$duration = isset($_POST['duration']) ? $db->real_escape_string($_POST['duration']) : "";
				$date_added = isset($_POST['date_added']) ? $db->real_escape_string($_POST['date_added']) : time();
				$genre = isset($_POST['genre']) ? $db->real_escape_string($_POST['genre']) : "";
				$year = isset($_POST['year']) ? $db->real_escape_string($_POST['year']) : "";
				$website = isset($_POST['website']) ? $db->real_escape_string($_POST['website']) : "";
				$country = isset($_POST['country']) ? $db->real_escape_string($_POST['country']) : "";

				$genre_id = 0;
				if ($genre != "") {
					$sql = $db->query("SELECT * FROM genre WHERE name LIKE '$genre' ");
					if ($sql->num_rows > 0) {
						$genre_id = $sql->fetch_assoc()['id'];
					}
					else{
						$ins = $db->query("INSERT INTO `genre`(`id`, `name`, `status`) VALUES (NULL, '$genre','active')");
						$genre_id = $db->insert_id;
					}
				}

				//check country
				$country_id = 0;
				if ($country != "") {
					$sql = $db->query("SELECT * FROM countries WHERE name = '$country'");
					if ($sql->num_rows > 0) {
						$country_id = $sql->fetch_assoc()['id'];
					}
				}

				//check if there are more artists
				$names = Strings::multipleSplit($artist_name, [",", "&", "x", "X", "and", "feat", "feat.", "ft", "ft.", "featuring"]);
				$artist_name = $names[0];

				//check the artist
				$artist_id = 0;

				$check = $db->query("SELECT * FROM web_artists WHERE name LIKE '$artist_name' ");
				if ($check->num_rows > 0) {
					$artist_id = $check->fetch_assoc()['id'];
				}
				else{
					//save artist
					$ins = $db->query("INSERT INTO `web_artists`(`id`, `webid`, `name`, `photo`, `resampled`, `biography`, `status`, `link`, `website`, `country`) VALUES (NULL, '0', '$artist_name', '', '', '', 'active', '', '$website', '$country_id')");
					if ($ins) {
						$artist_id = $db->insert_id;
					}
				}
				//check  the song
				$check= $db->query("SELECT * FROM web_songs WHERE title = '$title' AND artist= '$artist_id' ");
				if ($check->num_rows > 0) {
				    $data = $check->fetch_assoc();
				    //$db->query("UPDATE web_songs SET mp3_url = '$mp3_url' WHERE id = '{$data['id']}' ");
				    if(file_exists("../songs/".$filename)){
				        unlink("../songs/".$filename);
				    }
					echo json_encode(['status' => false, 'message' => "Already added"]);
				}
				else{
					//save the song
					$ins2 = $db->query("INSERT INTO `web_songs`(`id`, `webid`, `title`, `artist`, `album`, `length`, `artwork`, `resampled_artwork`, `mp3_url`, `dateAdded`, `genre`, `website`, `status`, `plays`, `downloads`, `color`, `small_art`, `year`) VALUES (NULL, '0', '$title', '$artist_id', '0', '$duration', '$artwork', '', '$mp3_url', '$date_added', '$genre_id','$website', 'active', '0', '0', '', '', '$year')");
					$song_id = $db->insert_id;
					//save supporting artists
					if (count($names) > 1) {
						$ids = [];
						for ($i=1; $i < count($names); $i++) { 
							$artist_name = $names[$i];
							$check = $db->query("SELECT * FROM web_artists WHERE name LIKE '$artist_name' ");
							if ($check->num_rows > 0) {
								$artist_id = $check->fetch_assoc()['id'];
								array_push($ids, "(NULL, '$song_id', '$artist_id')");
							}
							else{
								//save artist
								$ins = $db->query("INSERT INTO `web_artists`(`id`, `webid`, `name`, `photo`, `resampled`, `biography`, `status`, `link`, `website`, `country`) VALUES (NULL, '0', '$artist_name', '', '', '', 'active', '', '$website', '$country_id')");
								if ($ins) {
									$artist_id = $db->insert_id;
									array_push($ids, "(NULL, '$song_id', '$artist_id')");
								}
							}
						}

						//save contributing artists
						$db->query("INSERT INTO `contributing`(`id`, `song`, `artist`) VALUES ".implode(", ", $ids));
					}
					echo json_encode(['status' => true, 'message' => "Added", 'song' => $title]);
				}
			}
			else{
				echo json_encode(['status' => false, 'message' => "Failed to upload file"]);
			}
		}
		else{
			echo json_encode(['status' => false, 'message' => "Missing 'name' key **required"]);
		}
		break;
	
	default:
		echo json_encode(['status' => false, 'message' => "Unknown path - ".$path]);
		break;
}
?>