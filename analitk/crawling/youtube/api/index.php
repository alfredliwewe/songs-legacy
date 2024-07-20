<?php

require '../../../functions.php';
require '../../../includes/String.php';
require '../../../includes/FetchSongs.php';
require '../../../includes/URL.php';
require '../../../db.php';
$db3 = new mysql_like("../youtube.db3");

if (isset($_GET['getRows'])) {
	$data = [];

	$read = $db3->query("SELECT * FROM links WHERE status = 'saved' ");
	while ($row = $read->fetch_assoc()) {
		array_push($data, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($data);
}
elseif (isset($_POST['new_link'])) {
	$link = $db3->real_escape_string($_POST['new_link']);

	if (filter_var($link, FILTER_VALIDATE_URL)) {
		$obj = new URL($link);
		$queries = $obj->getQuery();
		if (isset($queries['v'])) {
			$text = file_get_contents("https://www.googleapis.com/youtube/v3/videos?part=id%2C+snippet&id=".$queries['v']."&key=AIzaSyAck-gqiy9ok-TFim33Ob6WZe_fKNN3GH8");

			//file_put_contents('sho.json', $text);
			//$text = file_get_contents("sho.json");
			$big = json_decode($text,true);
			$data = [];
			$snippet = $big['items'][0]['snippet'];
			$data['year'] = explode("-", $snippet['publishedAt'])[0];
			$data['title'] = $snippet['title'];
			$chars = explode("-", $data['title']);
			if (count($chars) > 1) {
				$data['title'] = $db3->real_escape_string(trim($chars[1]));
				$data['artist'] = $db3->real_escape_string(trim($chars[0]));

				if (isset($snippet['thumbnails']['standard'])) {
					$data['artwork'] = $snippet['thumbnails']['standard']['url'];
				}
				else{
					$data['artwork'] = $snippet['thumbnails']['medium']['url'];
				}
				$data['vid'] = $big['items'][0]['id'];

				$data['title'] = Strings::removeStrings($data['title'], ["(Music Video)", "(Official Video)", "(Official Music Video)", "(Visualizer)", "[Music Video]", "[Official Video]", "[Official Music Video]", "[Visualizer]", "(Official)", "[Official]"]);
				$data['title'] = Strings::trim($data['title'],6);

				if (!FetchSongs::isAdded($db, $data['artist'], $data['title'])) {
					//check vid
					$check = $db3->query("SELECT * FROM links WHERE vid = '{$data['vid']}'");
					if ($check->num_rows == 0) {
						$save = $db3->query("INSERT INTO links (id,link,artist,title,artwork,year,mp3_url,status,vid) VALUES (NULL, '$link', '{$data['artist']}', '{$data['title']}', '{$data['artwork']}', '{$data['year']}', '', 'saved', '{$data['vid']}')");

						echo json_encode(['status' => true,'type' => 'link']);
					}
					else{
						echo json_encode(['status' => false, 'message' => "Already added!"]);
					}
				}
				else{
					echo json_encode(['status' => false, 'message' => "Music Already added!"]);
				}
			}
			else{
				echo json_encode(['status' => false, 'message' => "Artist not found"]);
			}
		}
		else{
			echo json_encode(['status' => false, 'message' => "Link is not correct"]);
		}
	}
	else{
		//search
		$you_tube_data_api_key = 'AIzaSyAck-gqiy9ok-TFim33Ob6WZe_fKNN3GH8';

	    $api_url = 'https://www.googleapis.com/youtube/v3/search?key=' . $you_tube_data_api_key . '&q=' . urlencode($link) . '&part=snippet,id&maxResults=12';

	    $youtube_videos = file_get_contents($api_url);

	    if(!empty($youtube_videos)){
	        $youtube_videos_arr = json_decode( $youtube_videos, true);
	        if(!empty($youtube_videos_arr['items'])){
		        $results = [];
	            foreach($youtube_videos_arr['items'] as $ytvideo){
	                array_push($results, $ytvideo);
	            }
	            echo json_encode(['status' => true, 'type' => 'search', 'results' => $results]);
	        }
	        else{
	        	echo json_encode(['status' => false, 'message' => "Items not found"]);
	        }
	    }
	    else{
	    	echo json_encode(['status' => false, 'message' => "No response from search!"]);
	    }
	}
}
elseif (isset($_GET['getOne'])) {
	$read = $db3->query("SELECT * FROM links WHERE status = 'saved' LIMIT 0,1 ");
	if ($read->num_rows == 1) {
		$data = $read->fetch_assoc();
		$data['status'] = true;
		echo json_encode($data);
		$db3->query("UPDATE links SET status = 'done' WHERE id = '{$data['id']}' ");
	}
	else{
		echo json_encode(['status' => false, 'message' => "Probably finished"]);
	}
}
elseif (isset($_POST['doneOne'], $_POST['mp3_url'])) {
	$id = (int)$_POST['doneOne'];
	$mp3_url = $db->real_escape_string($_POST['mp3_url']);

	$db3->query("UPDATE links SET status = 'done', mp3_url = '$mp3_url' WHERE id = '$id' ");
	echo json_encode(['status' => true, 'message' => "Success"]);
}
elseif (isset($_POST['row_id'], $_POST['title_edit'], $_POST['artist'], $_POST['year'])) {
	$id = (int)$_POST['row_id'];
	$title = $db3->real_escape_string($_POST['title_edit']);
	$artist = $db3->real_escape_string($_POST['artist']);
	$year = $db3->real_escape_string($_POST['year']);

	$db3->query("UPDATE links SET title = '$title', artist = '$artist', year = '$year' WHERE id = '$id' ");
	echo json_encode(['status' => true]);
}
elseif (isset($_GET['searchWord'])) {
	$word = $_GET['searchWord'];

	$res = json_decode(file_get_contents("https://suggestqueries.google.com/complete/search?hl=en&ds=yt&client=youtube&hjson=t&cp=1&q=".urlencode($word)), true);

	$res = $res[1];
	$rows = [];

	foreach ($res as $r) {
		array_push($rows,$r[0]);
	}

	echo json_encode(['results' => $rows]);
}
?>