<?php 

//$db = new mysqli("localhost", "root", "password", "songs");
require '../db.php';

if (isset($_POST['data'])) {
	//echo "welcome";

	$data = json_decode($_POST['data'], true);

	if($data){
		//proceed
		$keys = [
			"name" => "", 
			"webid" => "", 
			"photo" => "", 
			"resampled" => "", 
			"biography" => "", 
			"link" => "", 
			"website" => ""
		];

		//check name if already
		if (isset($data['name'])) {
			$name = $db->real_escape_string($data['name']);
			
			$read = $db->query("SELECT * FROM web_artists WHERE name = '$name' ");
			if ($read->num_rows > 0) {
				$artist = $read->fetch_assoc();
			}
			else{
				//save the artist
				foreach($keys as $key => $value){
					if (isset($data[$key])) {
						$keys[$key] = $db->real_escape_string($data[$key]);
					}
				}

				$ins = $db->query("INSERT INTO `web_artists`(`id`, `webid`, `name`, `photo`, `resampled`, `biography`, `status`, `link`, `website`) VALUES (NULL, '{$keys['webid']}', '{$keys['name']}', '{$keys['photo']}', '{$keys['resampled']}', '{$keys['biography']}', 'active', '{$keys['link']}', '{$keys['website']}')");
				if ($ins) {
					$id = $db->insert_id;
					$artist = $db->query("SELECT * FROM web_artists WHERE id = '$id' ")->fetch_assoc();
				}
				else{
					echo json_encode(['status' => false, 'message' => "Could not insert. ".$db->error]);
					die();
				}
			}

			if (isset($artist)) {
				// save the songs...
				if (isset($data['songs'])) {
					

					$added = []; $already = []; $failed = [];

					foreach ($data['songs'] as $song_row) {

						$song_keys = [
							"webid"=>"",
							"title"=>"",
							"artist"=>"",
							"album"=>"",
							"length"=>"",
							"artwork"=>"",
							"mp3_url"=>"",
							"dateAdded"=>"",
							"genre"=>"",
							"website"=>""
						];

						// serializing keys...
						foreach($song_keys as $key => $value){
							if (isset($song_row[$key])) {
								$song_keys[$key] = $db->real_escape_string($song_row[$key]);
							}
						}

						//check if song is not added already
						$rcheck = $db->query("SELECT * FROM web_songs WHERE artist = '{$artist['id']}' AND title = '{$song_keys['title']}' ");
						if ($rcheck->num_rows > 0) {
							array_push($already, $song_keys['title']);
						}
						else{
							//insert new

							$ins2 = $db->query("INSERT INTO `web_songs`(`id`, `webid`, `title`, `artist`, `album`, `length`, `artwork`, `resampled_artwork`, `mp3_url`, `dateAdded`, `genre`, `website`, `status`, `plays`, `downloads`, `color`, `small_art`) VALUES (NULL, '{$song_keys['webid']}', '{$song_keys['title']}', '{$artist['id']}', '{$song_keys['album']}', '{$song_keys['length']}', '{$song_keys['artwork']}', '', '{$song_keys['mp3_url']}', '{$song_keys['dateAdded']}', '{$song_keys['genre']}', '{$song_keys['website']}', 'active', '0', '0', '', '')");
							if ($ins2) {
								array_push($added, $song_keys['title']);
							}
							else{
								array_push($failed, $song_keys['title']);
							}
						}
					}

					echo json_encode(['status' =>true,  'artist' => $name, 'message' => "Success", "added" => $added, "failed" => $failed, "already" => $already]);
				}
				else{
					echo "No songs {$keys['name']}";
				}
			}
			else{
				echo "Artist not found";
			}
		}
		else{
			echo json_encode(['status' => false, 'artist' => $keys['name'], 'message' => "Required field *name was not included in the request"]);
		}
	}
	else{
		echo json_encode(['status' => false, 'message' => "Can not not parse the input"]);
	}
}
else{
	echo "do data \nPost:";
	var_dump($_POST);
	var_dump($_GET);
}
?>