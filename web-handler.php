<?php
session_start();
require "./db.php";
//require "../functions.php";
require "functions.php";
require 'includes/Interests.php';
require 'includes/FetchSongs.php';
require 'includes/Artists.php';
require 'includes/String.php';
require 'includes/Relations.php';
require 'includes/EndPoint.php';
require 'includes/Arrays.php';
require 'includes/Genres.php';
require 'imageClass.php';

$time = time();
$dayz = date('z');
$year = date('Y');

if (isset($_GET['getCharts']) OR isset($_POST['getCharts'])) {
    $groups = [];

	$read = $db->query("SELECT * FROM chart_groups");
	while ($row = $read->fetch_assoc()) {
		$groups[$row['id']] = $row['name'];
	}
	$groups[0] = ['id' => 0,'name' => ""];

	$charts = [];
	$sql = $db->query("SELECT * FROM charts ORDER BY actions DESC LIMIT 4");
	while ($row = $sql->fetch_assoc()) {
		$row['group'] = $groups[$row['parent']];

		$songs = [];
		$read1 = $db->query("SELECT web_songs.id,web_songs.title, mp3_url, artwork, artist, resampled_artwork, name FROM chart_list JOIN web_songs ON chart_list.song = web_songs.id JOIN web_artists ON web_songs.artist = web_artists.id WHERE chart = '{$row['id']}' ");
		$names = [];
		while ($row1 = $read1->fetch_assoc()) {
			$artist_data = $db->query("SELECT * FROM web_artists WHERE id = '{$row1['artist']}' ")->fetch_assoc();
			if ($artist_data != null) {
				$row1['artist_data'] = $artist_data;
				if (count($names) < 3) {
					if (!in_array($artist_data['name'], $names)) {
						array_push($names, $artist_data['name']);
					}
				}
				array_push($songs, $row1);
			}
		}
		$row['songs'] = $songs;
		$row['names'] = implode(",", $names)." and many more";
		array_push($charts, $row);
	}

	echo json_encode($charts);
}
elseif (isset($_POST['getChart'])) {
	$id = (int)$_POST['getChart'];

	$data = $db->query("SELECT * FROM charts WHERE id = '$id' ")->fetch_assoc();
	$songs = [];
	$read1 = $db->query("SELECT web_songs.id,web_songs.title, mp3_url, artwork, artist, resampled_artwork, name FROM chart_list JOIN web_songs ON chart_list.song = web_songs.id JOIN web_artists ON web_songs.artist = web_artists.id WHERE chart = '$id' ");
	
	while ($row1 = $read1->fetch_assoc()) {
		$artist_data = $db->query("SELECT * FROM web_artists WHERE id = '{$row1['artist']}' ")->fetch_assoc();
		if ($artist_data != null) {
			$row1['artist_data'] = $artist_data;
			array_push($songs, $row1);
		}
	}
	$data['songs'] = $songs;
	$data['group'] = $data['parent'] == 0 ? "" : $db->query("SELECT * FROM chart_groups WHERE id = '{$data['parent']}' ")->fetch_assoc()['name'];
	echo json_encode($data);
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
			if ($row != null) {
				/*$download = false;
		        //
		        if (strlen($row['resampled_artwork']) > 3) {
		        	if (!file_exists("artwork/".$row['resampled_artwork'])) {
		        		// download...
		        		$download = true;
		        	}
		        }
		        else{
		        	$download = true;
		        }

		        if ($download) {
		        	$row['resampled_artwork'] = rand(10001,90009)."_".rand(10001,90009)."_".rand(10001,90009).".png";
		        	file_put_contents("artwork/".$row['resampled_artwork'], file_get_contents($row['artwork']));
		        	$db->query("UPDATE web_songs SET resampled_artwork = '{$row['resampled_artwork']}' WHERE id = '{$row['id']}' ");
		        }*/
				$row['artist_data'] = $db->query("SELECT * FROM web_artists WHERE id = '{$row['artist']}' ")->fetch_assoc();
				array_push($data, $row);
			}
		}
		$i += 1;
	}

	echo json_encode($data);
}
elseif (isset($_GET['getProductsHome']) OR isset($_POST['getProductsHome'])) {
	//save visit
	$dayz= date('z');
	$ip = $_SERVER['REMOTE_ADDR'];
	$ua = $db->real_escape_string($_SERVER['HTTP_USER_AGENT']);
	//perform check
	$check = $db->query("SELECT * FROM ip_visits WHERE ip = '$ip' AND dayz = '$dayz' AND year = '$year' ");
	if ($check->num_rows == 0) {
	    $db->query("INSERT INTO `ip_visits`(`id`, `ip`, `dayz`, `year`, `time`, `ua`) VALUES (NULL, '$ip', '$dayz', '$year', '$time', '$ua') ");
	    $title = "Music App Visited";
	    $content = "UA:: ".$ua." --".date('r');
	    EndPoint::saveNotification($title, $content, "", "AMUZE_VISIT");
	}
	///////////////////////////////////////////////


	if (isset($_POST['user'])) {
		$user = $_POST['user'];
	}
	else{
		$user = $_GET['user'];
	}
	$user_id = $user;
	//get music and categories

	//check the genre cache
	$genre_cache = $db->query("SELECT * FROM global_cache WHERE name = 'genre_cache' AND user = '$user' AND `time` > ($time - (3600 * 24 * 4)) ");
	if ($genre_cache->num_rows > 0) {
		$gg = $genre_cache->fetch_assoc();
		$genres = json_decode($gg['value'], true);

		$genre_store = [];
		$genre_list = [];
		$ids = array_keys($genres);
		if (count($ids) > 0) {
			$ids_str = implode(",", $ids);

			$read = $db->query("SELECT id,name,actions FROM `genre` WHERE id IN ($ids_str)");
			while ($row = $read->fetch_assoc()) {
				$genres[$row['id']] = 0;
				$genre_store[$row['id']]= $row;
			}
			$genres[0] = 0;
			$genre_store[0] = ['name'=>"Happy Mix",'id'=>0];
		}
	}
	else{
		$read = $db->query("SELECT id,name,actions FROM `genre` ORDER BY actions DESC LIMIT 20");
		$genres = [];
		$genre_store = [];
		$genre_list = [];
		while ($row = $read->fetch_assoc()) {
			$genres[$row['id']] = 0;
			$genre_store[$row['id']]= $row;
		}
		$genres[0] = 0;
		$genre_store[0] = ['name'=>"Happy Mix",'id'=>0];
		//read songs played

		$sql = $db->query("SELECT genre FROM song_plays JOIN web_songs ON song_plays.song = web_songs.id WHERE song_plays.user = '$user' ");
		while($row = $sql->fetch_assoc()){
			if (isset($genres[$row['genre']])) {
				$genres[$row['genre']] += 1;
			}
		}
		arsort($genres);

		//save genres cache
		$genres_str = json_encode($genres);
		$db->query("DELETE FROM global_cache WHERE name = 'genre_cache' AND user = '$user'");
		$ins = $db->query("INSERT INTO `global_cache`(`id`, `user`, `name`, `value`, `time`) VALUES (NULL, '$user', 'genre_cache', '$genres_str', '$time')");
	}//////now we have genres sorted and saved

	$disliked = FetchSongs::disliked($db, $user_id);
	$dislikedStmt = count($disliked) > 0 ? " AND id NOT INT (".implode(",",$disliked).") " : "";

	$mega = [];

	$count = 0;
	$genres_id = array_keys($genres);
	$small = array_slice($genres_id, 0,14);
	
	//get top songs from genres
	$songs = [];
	$genre_songs = [];
	$read = $db->query("SELECT id,trending FROM genre WHERE id IN (".implode(",", $small).")");
	while ($row = $read->fetch_assoc()) {
		$ids = explode(",", $row['trending']);
		$songs = [...$songs, ...array_slice($ids, 0,20)];
		$genre_songs[$row['id']] = array_slice($ids, 0,20);
	}
	$artists = [];
	$read = $db->query("SELECT DISTINCT artist FROM web_songs WHERE id IN (".implode(",", $songs).")");
	while ($row = $read->fetch_assoc()) {
		array_push($artists,$row['artist']);
	}

	$artist_store = Artists::getArtists($db, $artists);

	foreach ($genres as $key => $value){
		array_push($genre_list, $genre_store[$key]);
		if ($count < 14 && $key != 0) {
			
			$genre = $key;
			$data = [];
			$data['label'] = $genre_store[$genre]['name'];
			$data['id'] = $genre;
			$names = [];
			$artwork = null;

			$products = [];
			$ids = implode(",", $genre_songs[$key]);
			$sql = $db->query("SELECT *,web_songs.id AS song_id FROM web_songs WHERE id IN ($ids) $dislikedStmt AND artist != 0");
			while ($row = $sql->fetch_assoc()) {
				$song_id = $row['song_id'];
				$row['unik'] = rand(10001,99999);
				$download = false;
		        //
		        if (strlen($row['resampled_artwork']) > 3) {
		        	if (!file_exists("artwork/".$row['resampled_artwork'])) {
		        		// download...
		        		$download = true;
		        	}
		        	else{
		        		if ($artwork == null) {
		        			$artwork = $row['resampled_artwork'];
		        		}
		        	}
		        }
		        else{
		        	$download = true;
		        }

		        if ($download) {
		        	/*$row['resampled_artwork'] = rand(10001,90009)."_".rand(10001,90009)."_".rand(10001,90009).".png";
		        	file_put_contents("artwork/".$row['resampled_artwork'], file_get_contents($row['artwork']));
		        	$db->query("UPDATE web_songs SET resampled_artwork = '{$row['resampled_artwork']}' WHERE id = '{$row['id']}' ");*/
		        }

		        $row['rating'] = "2 stars";
		        $row['featured'] = "";
		        $row['artist_data'] = $artist_store[$row['artist']];
		        if ($row['artist_data'] != null) {
		        	$row['comments'] = 0; //$db->query("SELECT * FROM comments WHERE song = '$song_id' ")->num_rows;
			        $row['artist'] = $row['artist_data']['name'];
			        if (count($names) < 3) {
			        	array_push($names, $row['artist_data']['name']);
			        }
					array_push($products, $row);
		        }
			}

			$data['songs'] = $products;
			$data['names'] = implode(", ", $names)." and more";
			$data['artwork'] = $artwork == null ? $config['host']."artwork/icon.png" : $config['host']."thumbnail.php?artwork={$artwork}";
			if (count($products) > 1) {
				array_push($mega, $data);
			}
		}

		$count += 1;
	}

	$adverts = [];
	$read1 = $db->query("SELECT * FROM adverts");
	while ($row = $read1->fetch_assoc()) {
		$ext = fileExtension($row['file']);
		$row['isImage'] = in_array($ext, $image_extensions);
		array_push($adverts, $row);
	}

	$playlists = [];
	$read1 = $db->query("SELECT * FROM playlist_admin");
	while ($row = $read1->fetch_assoc()) {
		array_push($playlists, $row);
	}

	//////////////////////////////////
	/// 	2nd Line 				//
	//////////////////////////////////
	
	$artists = Interests::favArtists($db,$user);
    $followed = Interests::followedArtists($db,$user);
    //check from cache
    $cache_check = $db->query("SELECT * FROM global_cache WHERE name = 'trending_artists' AND user = '$user' AND `time` > ($time - (3600 * 6)) ");
    if ($cache_check->num_rows > 0) {
    	$dd = $cache_check->fetch_assoc();
    	$trending = explode(",", $dd['value']);
    }
    else{
    	$trending = Artists::trending($db, [...$artists, ...$followed]); //get more trendind artists

    	//delete old cache
    	$db->query("DELETE FROM global_cache WHERE name = 'trending_artists' AND user = '$user' ");
    	//save to cache
    	$str_ids = implode(",", $trending);
    	$ins = $db->query("INSERT INTO `global_cache`(`id`, `user`, `name`, `value`, `time`) VALUES (NULL, '$user', 'trending_artists', '$str_ids', '$time')");
    }

    $all = [...$artists, ...$followed, ...$trending];
    if (count($all) < 10) {
    	// add trending...
    	$read = $db->query("SELECT id FROM web_artists ORDER BY actions DESC LIMIT 40");
    	while ($row = $read->fetch_assoc()) {
    		array_push($all, $row['id']);
    	}
    }
    //shuffle($all);
    
    //$arrays = [];
    $inline_artists = [];

    $countries = getCountries($db);

    $arrays = Artists::byCountries($db,$all);

    //get artists and keep them
    $artist_store = [];
    if(count($all) > 0){
        $read = $db->query("SELECT * FROM web_artists WHERE id IN (".implode(",",$all).")");
        while ($row = $read->fetch_assoc()) {
            $artist_store[$row['id']] = $row;
        }
    }

    function sortByActions($a, $b) {
	    return $a["actions"] - $b["actions"];
	}

	$listened = Relations::getArtistSongs($db,$user); //get listened songs
	//$listened = [...$listened, ...FetchSongs::artistsTopSongs($db, $all)];
	$listened = FetchSongs::artistsTopSongs($db, $all);
	file_put_contents('check.json', json_encode($listened));

	//$missing = Arrays::findMissingValues($all, array_keys($listened));

    $cmega = [];
    foreach ($arrays as $country => $artists) {
        $first = $artist_store[$artists[0]];
        $first_id = $artists[0];
        $names = [];

        $countries_artist = [];
        foreach ($artists as $id) {
        	array_push($countries_artist, $artist_store[$id]);
        }

		usort($countries_artist, "sortByActions");
		$artists = Arrays::getArrayByKey($countries_artist, "id");

		
        $songs = [];
        foreach ($artists as $artist) {
        	if (isset($listened[$artist])) {
        		$songs = [...$songs, ...array_slice($listened[$artist], 0,3)];
        	}
        }

        
        
        shuffle($songs);
        $song_list = [];
        $artist_id = 0;
        if (count($songs) > 0) {
	        $read = $db->query("SELECT * FROM web_songs WHERE id IN (".implode(",",$songs).") $dislikedStmt ORDER BY plays DESC");
	        while ($row = $read->fetch_assoc()) {
	        	if ($artist_id == 0) {
	        		$artist_id = $row['artist'];
	        	}
	        	$row['song_id'] = $row['id'];
	            $row['artist_data'] = $artist_store[$row['artist']];
	            $row['artist'] = $row['artist_data']['name'];
	            /*if ($row['website'] == "mdundo") {
	            	$row['mp3_url'] = "https://mdundo.com/stream/".$row['webid'];
	            }*/

	            if (count($names) < 3) {
	            	if (!in_array($row['artist_data']['name'], $names)) {
	            		array_push($names, $row['artist_data']['name']);
	            	}
	            }
	            array_push($song_list, $row);
	        }
	    }

	    //if (count($song_list) > 0) {
	    	$row['artwork'] = $config['host']."web-handler.php?redirectArtistPicture={$song_list[0]['artist_data']['id']}";
	        $row['names'] = implode(", ", $names)." and more";
	        //$row['country'] = $data['countries'][$i];
	        $row['songs'] = $song_list;
	        $row['label'] = $words[rand(0, count($words)-1)].$countries[$country]['name'];
	        array_push($cmega, $row);
	    //}
    }
    shuffle($cmega);

    header('Content-Type: application/json; charset=utf-8');
	echo json_encode([
		//'mega' => $mega, 
		'adverts' => $adverts, 
		'genres' => $genre_list, 
		//'second' => $cmega, 
		'playlists' => $playlists,
		'categories' => [
			[
				'category' => "Songs by genres",
				'lists' => $mega
			],
			[
				'category' => "Exclusive Countries",
				'lists' => $cmega
			]
		]
	]);
}
elseif (isset($_POST['getRelated'], $_POST['type'], $_POST['user'])) {
	$song_id = $_POST['getRelated'];
	$user_id = $user = (int)$_POST['user'];

	$data = []; //empty song list store

	$song_data = $db->query("SELECT * FROM web_songs WHERE id = '$song_id' ")->fetch_assoc();
	
	if($song_data['year'] != 0){
	    $min = $song_data['year'] - 4;
	    $max = $song_data['year'] + 4;
	}
	else{
	    $min = 0;
	    $max = date('Y');
	}

	$relatedArtists = [$song_data['artist'], ...Artists::relatedArtists($db, $song_data['artist'])];

	$artists = []; //artist all information from db
	$read = $db->query("SELECT * FROM web_artists WHERE id IN (".implode(",", $relatedArtists).")");
	while ($row = $read->fetch_assoc()) {
		$artists[$row['id']] = $row;
	}

	$disliked = FetchSongs::disliked($db, $user_id);
	$dislikedStmt = count($disliked) > 0 ? " AND id NOT INT (".implode(",",$disliked).") " : "";

	
	$read = $db->query("SELECT * FROM web_songs WHERE year BETWEEN '$min' AND '$max' $dislikedStmt AND id != '$song_id' AND artist IN (".implode(",", $relatedArtists).") ORDER BY plays DESC LIMIT 2000");

	$artist_score = [];
	$song_store = [];

	while ($row = $read->fetch_assoc()) {
		if (isset($artist_score[$row['artist']])) {
			$artist_score[$row['artist']] += 1;
		}
		else{
			$artist_score[$row['artist']] = 1;
		}

		//check for monopoly
		if ($artist_score[$row['artist']] < 5) {
			$song_id = $row['id'];
			$row['song_id'] = $song_id;

			$row['tags'] = [];
			$row['artist_data'] = $artists[$row['artist']];
		    if ($row['artist_data'] != null) {
		    	$row['comments'] = $db->query("SELECT * FROM comments WHERE song = '$song_id' ")->num_rows;
		        $row['artist'] = $row['artist_data']['name'];
		        if ($row['genre'] == $song_data['genre']) {
		        	array_push($data, $row);
					//$song_store[$song_id] = $row;
		        }
				else{
					array_push($song_store, $row);
				}
		    }
		}
	}

	echo json_encode([...$data, ...$song_store]);
}
elseif (isset($_POST['getRelated1'], $_POST['type'], $_POST['user'])) { ////this is for experimental please remove it in future
	$song_id = $_POST['getRelated1'];
	$user_id = $user = (int)$_POST['user'];

	$data = []; //empty song list store

	$song_data = $db->query("SELECT * FROM web_songs WHERE id = '$song_id' ")->fetch_assoc();
	$a_data = $db->query("SELECT * FROM web_artists WHERE id = '{$song_data['artist']}' ")->fetch_assoc();

	$related_genres = [];
	if ($song_data['genre'] != 0) {
		$related_genres = Genres::related($db, $song_data['genre']);
	}

	// find this artist's friends
	$related = Artists::sameGroups($db, $a_data['id']);
	
	if($song_data['year'] != 0){
	    $min = $song_data['year'] - 4;
	    $max = $song_data['year'] + 4;
	}
	else{
	    $min = 0;
	    $max = date('Y');
	}

	$relatedArtists = [$song_data['artist'], ...Artists::relatedArtists($db, $song_data['artist'])];

	$artists = []; //artist all information from db
	$read = $db->query("SELECT * FROM web_artists WHERE id IN (".implode(",", $relatedArtists).")");
	while ($row = $read->fetch_assoc()) {
		$artists[$row['id']] = $row;
	}

	$disliked = FetchSongs::disliked($db, $user_id);
	$dislikedStmt = count($disliked) > 0 ? " AND id NOT INT (".implode(",",$disliked).") " : "";

	
	$read = $db->query("SELECT * FROM web_songs WHERE year BETWEEN '$min' AND '$max' $dislikedStmt AND id != '$song_id' AND artist IN (".implode(",", $relatedArtists).") ORDER BY plays DESC LIMIT 2000");

	$artist_score = [];
	$song_store = [];
	$mega = [];
	$score_index = [];

	while ($row = $read->fetch_assoc()) {
		if (isset($artist_score[$row['artist']])) {
			$artist_score[$row['artist']] += 1;
		}
		else{
			$artist_score[$row['artist']] = 1;
		}

		//check for monopoly
		if ($artist_score[$row['artist']] < 5) {
			$song_id = $row['id'];
			$row['song_id'] = $song_id;

			//find the score
			$score = 0;
			if($row['artist'] == $a_data['id']){
				$score += 50;
			}
			if (in_array($row['artist'], $related)) {
				$score += 80;
			}
			if ($row['genre'] == $song_data['genre']) {
				$score += 60;
			}
			if (in_array($row['genre'], $related_genres)) {
				$score += 40;
			}


			$row['tags'] = [];
			$row['artist_data'] = $artists[$row['artist']];
		    if ($row['artist_data'] != null) {
		    	$row['comments'] = $db->query("SELECT * FROM comments WHERE song = '$song_id' ")->num_rows;
		        $row['artist'] = $row['artist_data']['name'];
		        if ($row['genre'] == $song_data['genre']) {
		        	array_push($data, $row);
					//$song_store[$song_id] = $row;
		        }
				else{
					array_push($song_store, $row);
				}
				if($a_data['country'] != 0 AND $a_data['country'] == $row['artist_data']['country']){
					$score += 80;
				}
		    }
		    $row['score'] = $score;
		    $mega[$row['id']] = $row;
		    $score_index[$row['id']] = $score;
		}
	}
	arsort($score_index);
	$pure = [];
	foreach ($score_index as $key => $val) {
	    array_push($pure, $mega[$key]);
	}


	//echo json_encode([...$data, ...$song_store]);
	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($pure);
}
elseif (isset($_GET['getAdverts']) OR isset($_POST['getAdverts'])) {
	$adverts = [];
	$read1 = $db->query("SELECT * FROM adverts");
	while ($row = $read1->fetch_assoc()) {
		$ext = fileExtension($row['file']);
		$row['isImage'] = in_array($ext, $image_extensions);
		array_push($adverts, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($adverts);
}
elseif (isset($_GET['getArtistFromSong'])) {
	$song_id = (int)trim($_GET['getArtistFromSong']);
	$artist_id = $db->query("SELECT artist FROM web_songs WHERE id = '$song_id' ")->fetch_assoc()['artist'];

	echo json_encode($db->query("SELECT * FROM web_artists WHERE id = '$artist_id' ")->fetch_assoc());
}
elseif (isset($_GET['getAllSongs'])) {
	$artist_id = (int)trim($_GET['getAllSongs']);
	$user_id = $user = (int)trim($_GET['user']);

	//increase user artist relationship
	$check = $db->query("SELECT * FROM user_artist WHERE user = '$user' AND artist = '$artist_id' ");
	if ($check->num_rows > 0) {
		$db->query("UPDATE user_artist SET value = value + 1 WHERE user = '$user' AND artist = '$artist_id' ");
	}
	else{
		$db->query("INSERT INTO `user_artist`(`id`, `user`, `artist`, `value`) VALUES (NULL, '$user', '$artist_id', '1')");
	}

	$artist_data = $db->query("SELECT * FROM web_artists WHERE id = '$artist_id' ")->fetch_assoc();

	$songs = [];
	$read = $db->query("SELECT web_songs.id AS id, web_songs.title AS title, web_songs.resampled_artwork AS artwork, resampled_artwork, web_artists.name AS name, artist, downloads, plays,mp3_url FROM web_songs JOIN web_artists ON web_songs.artist = web_artists.id WHERE web_songs.artist = '$artist_id' ");
	while ($row = $read->fetch_assoc()) {
		$song_id = $row['id'];

		$row['featured'] = "";
		$row['artist_data'] = $artist_data;
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

	
	echo json_encode(['status' => true, 'comments' => $comments]);
}
elseif (isset($_POST['sendComment'], $_POST['song'])) {
	$user = (int)$_POST['user'];
	$rating = $db->real_escape_string($_POST['rating']);
	$comment = $db->real_escape_string(str_replace("<br>", "\n", $_POST['sendComment']));
	$song = (int)trim($_POST['song']);
	$time = time();

	$parent = isset($_POST['parent']) ? (int)$_POST['parent'] : 0;

	$ins = $db->query("INSERT INTO `comments`(`id`, `song`, `user`, `parent`, `comment`, `time`, `rating`) VALUES (NULL, '$song', '$user', '$parent', '$comment', '$time', '$rating')");
	if ($ins) {
		$comment_id = $db->insert_id;

		$read = $db->query("SELECT * FROM comments WHERE id = '$comment_id' ");
		$row = $read->fetch_assoc();
		$row['user_data'] = $db->query("SELECT * FROM users WHERE id = '{$row['user']}' ")->fetch_assoc();
		$row['user_name'] = $row['user_data']['name'];
		$row['comment'] = nl2br($row['comment']);
		$row['time'] = time_ago($row['time']);		
		$row['replies'] = [];
		

		echo json_encode(['status' => true, 'comment' => $row, 'comment_id' => $row['id']]);
		
	}
	else{
		echo json_encode(['status' => false, 'message' => $db->error]);
	}
}
elseif (isset($_GET['setTheme'])) {
	setcookie("theme", $_GET['setTheme'], time()+ (3600*24*30));
	echo "true";
}
elseif (isset($_GET['searchModal']) OR isset($_POST['searchModal'])) {
	$search = isset($_GET['searchModal']) ? $db->real_escape_string($_GET['searchModal']) : $db->real_escape_string($_POST['searchModal']);
	$type = isset($_POST['type']) ? $_POST['type'] : "all";
	$user_id = isset($_POST['user']) ? (int)$_POST['user'] : 1;

	$data = [];
	if ($type == "all") {
		$chars = explode(" ", $search);
		if (count($chars) > 1) {
			$first = $db->real_escape_string($chars[0]);
			$second = $db->real_escape_string(implode(" ", array_slice($chars,1)));
			$mega_sql = $db->query("SELECT web_songs.id FROM web_songs JOIN web_artists ON web_songs.artist = web_artists.id WHERE web_songs.title LIKE '%{$search}%' OR web_songs.title LIKE '%$first%' AND web_artists.name LIKE '%$second%' OR web_songs.title LIKE '%$second%' AND web_artists.name LIKE '%$first%' ");
			$ids = [];
			while ($row = $mega_sql->fetch_assoc()) {
				array_push($ids, $row['id']);
			}

			$ids_str = implode(",",$ids);

			if (count($ids)) {
				$read = $db->query("SELECT * FROM web_songs WHERE id IN ($ids_str) ORDER BY plays DESC LIMIT 10 ");
				while ($row = $read->fetch_assoc()) {
					$row['type'] = 'song';
					$row['song_id'] = $row['id'];
					$row['artist_data'] = $db->query("SELECT * FROM web_artists WHERE id = '{$row['artist']}' ")->fetch_assoc();
					if ($row['artist_data'] !=null) {
						$row['name'] = $row['artist_data']['name'];
						array_push($data, $row);
					}
				}
			}
		}
		else{
			$read = $db->query("SELECT * FROM web_songs WHERE title LIKE '%{$search}%' ORDER BY plays DESC LIMIT 10 ");
			while ($row = $read->fetch_assoc()) {
				$row['type'] = 'song';
				$row['song_id'] = $row['id'];
				$row['artist_data'] = $db->query("SELECT * FROM web_artists WHERE id = '{$row['artist']}' ")->fetch_assoc();
				if ($row['artist_data'] !=null) {
					$row['name'] = $row['artist_data']['name'];
					array_push($data, $row);
				}
			}
		}

		$read = $db->query("SELECT * FROM web_artists WHERE name LIKE '%{$search}%' ORDER BY actions DESC LIMIT 7");
		while ($row = $read->fetch_assoc()) {
			$row['type'] = 'artist';
			array_push($data, $row);
		}
	}
	elseif ($type == "music") {
		$read = $db->query("SELECT * FROM web_songs WHERE title LIKE '%{$search}%' ORDER BY plays DESC LIMIT 10 ");
		while ($row = $read->fetch_assoc()) {
			$row['type'] = 'song';
			$row['song_id'] = $row['id'];
			$row['artist_data'] = $db->query("SELECT * FROM web_artists WHERE id = '{$row['artist']}' ")->fetch_assoc();
			if ($row['artist_data'] !=null) {
				$row['name'] = $row['artist_data']['name'];
				array_push($data, $row);
			}
		}
		if(count($data) == 0){
			//save not found
			$ins = $db->query("INSERT INTO `not_found_search`(`id`, `user`, `word`, `type`, `time`) VALUES (NULL, '$user_id', '$search','$type', '$time')");
		}

		/*try{
			$word = urlencode($search);

			$res = json_decode(file_get_contents("https://suggestqueries.google.com/complete/search?hl=en&ds=yt&client=youtube&hjson=t&cp=1&q=".$word), true);

			$res = $res[1];
			$rows = [];
			if ($res != null) {
				foreach ($res as $r) {
					array_push($data,['text' => $r[0], 'type' => 'youtube']);
				}
			}
		}
		catch(Exception $e){
			//do nothing
		}*/
	}
	elseif ($type == "artists") {
		$read = $db->query("SELECT * FROM web_artists WHERE name LIKE '%{$search}%' ORDER BY actions DESC LIMIT 7");
		while ($row = $read->fetch_assoc()) {
			$row['type'] = 'artist';
			array_push($data, $row);
		}

		if(count($data) == 0){
			//save not found
			$ins = $db->query("INSERT INTO `not_found_search`(`id`, `user`, `word`, `type`, `time`) VALUES (NULL, '$user_id', '$search','$type', '$time')");
		}

		/*try{
			$word = urlencode($search);

			$res = json_decode(file_get_contents("https://suggestqueries.google.com/complete/search?hl=en&ds=yt&client=youtube&hjson=t&cp=1&q=".$word), true);

			$res = $res[1];
			$rows = [];

			if ($res != null) {
				foreach ($res as $r) {
					array_push($data,['text' => $r[0], 'type' => 'youtube']);
				}
			}
		}
		catch(Exception $e){
			//do nothing
		}*/
	}
	elseif ($type == "playlists") {
		// code...
	}
	elseif ($type == "charts") {
		$read = $db->query("SELECT * FROM charts WHERE name LIKE '%{$search}%' ORDER BY actions DESC LIMIT 7");
		while ($row = $read->fetch_assoc()) {
			$row['type'] = 'charts';
			array_push($data, $row);
		}
	}

	echo json_encode($data);
}
elseif (isset($_POST['searchYoutube'])) {
	//search
	$link = $_POST['searchYoutube'];
	$you_tube_data_api_key = 'AIzaSyAck-gqiy9ok-TFim33Ob6WZe_fKNN3GH8';

    $api_url = 'https://www.googleapis.com/youtube/v3/search?key=' . $you_tube_data_api_key . '&q=' . urlencode($link) . '&part=snippet,id&order=viewCount&maxResults=12';

    $youtube_videos = file_get_contents($api_url);
    $results = [];

    if(!empty($youtube_videos)){
        $youtube_videos_arr = json_decode( $youtube_videos, true);
        if(!empty($youtube_videos_arr['items'])){
	        
            foreach($youtube_videos_arr['items'] as $ytvideo){
            	$ytvideo['thumbnail'] = $ytvideo['snippet']['thumbnails']['default']['url'];
            	$ytvideo['title'] = $ytvideo['snippet']['title'];
            	$ytvideo['description'] = $ytvideo['snippet']['description'];
            	$ytvideo['vid'] = $ytvideo['id']['videoId'];
                array_push($results, $ytvideo);
            }
            //echo json_encode(['status' => true, 'type' => 'search', 'results' => $results]);
        }
        else{
        	//echo json_encode(['status' => false, 'message' => "Items not found"]);
        }
    }
    else{
    	//echo json_encode(['status' => false, 'message' => "No response from search!"]);
    }

    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($results);
}
elseif (isset($_POST['suggestionsYoutube'])) {
	$search = $_POST['suggestionsYoutube'];
	$data = [];
	try{
		$word = urlencode($search);

		$res = json_decode(file_get_contents("https://suggestqueries.google.com/complete/search?hl=en&ds=yt&client=youtube&hjson=t&cp=1&q=".$word), true);

		$res = $res[1];
		$rows = [];
		if ($res != null) {
			foreach ($res as $r) {
				array_push($data,['text' => $r[0], 'type' => 'youtube']);
			}
		}
	}
	catch(Exception $e){
		//do nothing
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
		$data['status'] = true;
		echo json_encode($data);
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
elseif (isset($_POST['saveSongPlay'], $_POST['percent'])) {
	$id = (int)$_POST['saveSongPlay'];
	$percent = (int)$_POST['percent'];
	//$user_id = 13;

	//$db->query("UPDATE web_songs SET plays = plays + 1 WHERE id = '$song_id' ");

	$ins = $db->query("UPDATE song_plays SET progress = '$percent' WHERE id = '$id' ");
	if ($ins AND $db->affected_rows > 0) {
		echo json_encode(['status' => true, 'message' => "Success"]);
	}
	else{
		echo json_encode(['status' => false, 'message' => $db->error." -> Progress not saved"]);
	}
}
elseif (isset($_POST['getSongDetails'], $_POST['coordinates'], $_POST['user'], $_POST['user_type'])) {
	$song_id = (int)trim($_POST['getSongDetails']);
	$user = (int)$_POST['user'];
	$type = $db->real_escape_string($_POST['user_type']);

	$data = $db->query("SELECT * FROM web_songs WHERE id = '$song_id' ")->fetch_assoc();
	$artist_id = $data['artist'];

	//save progress data
	$ins = $db->query("INSERT INTO `song_plays`(`id`, `user`, `type`, `song`, `time`, `progress`) VALUES (NULL, '$user', '$type', '$song_id', '$time', '0')");
	$token = $db->insert_id;
	$db->query("UPDATE web_songs SET plays  = plays + 1 WHERE id = '$song_id' ");
	$db->query("UPDATE web_artists SET actions = actions + 1 WHERE id = '$artist_id' ");

	//save user artist relations
	$check = $db->query("SELECT * FROM user_artist WHERE user = '$user' AND artist = '$artist_id' ");
	if ($check->num_rows > 0) {
		$db->query("UPDATE user_artist SET value = value + 1 WHERE user = '$user' AND artist = '$artist_id' ");
	}
	else{
		$db->query("INSERT INTO `user_artist`(`id`, `user`, `artist`, `value`) VALUES (NULL, '$user', '$artist_id', '1')");
	}

	//save user song relations
	$check = $db->query("SELECT * FROM user_song WHERE user = '$user' AND song = '$song_id' ");
	if ($check->num_rows > 0) {
		$db->query("UPDATE user_song SET value = value + 1 WHERE user = '$user' AND song = '$song_id' ");
	}
	else{
		$db->query("INSERT INTO `user_song`(`id`, `user`, `song`, `value`,`artist`) VALUES (NULL, '$user', '$song_id', '1', '$artist_id')");
	}

	$data['comments'] = (int)$db->query("SELECT COUNT(id) AS count_all FROM comments WHERE song = '$song_id' ")->fetch_assoc()['count_all'];
	$data['likes'] = (int)$db->query("SELECT COUNT(id) AS count_all FROM likes WHERE song = '$song_id' ")->fetch_assoc()['count_all'];
	$data['artist_data'] = $db->query("SELECT * FROM web_artists WHERE id = '{$data['artist']}' ")->fetch_assoc();
	$data['artist_data']['likes'] = (int)$db->query("SELECT COUNT(id) AS count_all FROM followers WHERE artist = '$song_id' ")->fetch_assoc()['count_all'];
	$data['artist_data']['songs'] = (int)$db->query("SELECT COUNT(id) AS count_all FROM web_songs WHERE artist = '{$data['artist']}' ")->fetch_assoc()['count_all'];
	$data['token'] = $token;
	if ($type == "visitor") {
		$data['hasLiked'] = false;
	}
	else{
		$data['hasLiked'] = $db->query("SELECT * FROM likes WHERE song = '$song_id' AND user ='$user' ")->num_rows > 0;
	}
	echo json_encode($data);
}
elseif (isset($_GET['redirectFullArtwork'])) {
	$id = (int)$_GET['redirectFullArtwork'];

	$data = $db->query("SELECT * FROM web_songs WHERE id = '$id' ")->fetch_assoc();
	$done = false;

	if (strlen($data['resampled_artwork']) > 3) {
		if (file_exists("artwork/".$data['resampled_artwork'])) {
			$done = true;
			header("location: artwork/".$data['resampled_artwork']);
		}
	}
	if (!$done) {
		header("location: ".$data['artwork']);
	}
}
elseif (isset($_GET['redirectFullArtistPicture'])) {
	$id = (int)$_GET['redirectFullArtistPicture'];

	$data = $db->query("SELECT * FROM web_artists WHERE id = '$id' ")->fetch_assoc();
	$done = false;

	if (strlen($data['resampled']) > 3) {
		if (file_exists("artwork/".$data['resampled'])) {
			$done = true;
			header("location: artwork/".$data['resampled']);
		}
	}
	if (!$done) {
		if (strpos($data['photo'], "http") === false) {
			header("location: uploads/artists/".$data['photo']);
		}
		else{
			header("location: ".$data['photo']);
		}
	}
}
elseif (isset($_GET['redirectArtistPicture'])) {
	$id = (int)$_GET['redirectArtistPicture'];

	$data = $db->query("SELECT * FROM web_artists WHERE id = '$id' ")->fetch_assoc();
	$done = false;

	if (strlen($data['resampled']) > 3) {
		if (file_exists("uploads/artists/".$data['resampled'])) {
			$done = true;
			header("location: uploads/artists/".$data['resampled']);
		}
	}
	if (!$done) {
		if (strlen($data['photo']) > 3) {
			if (strpos($data['photo'], "http") === false) {
				$resampled = uniqid().".png";
				$img = new rodzImage("uploads/artists/".$data['photo']);
				$img->cropImage("uploads/artists/".$resampled);

				$db->query("UPDATE web_artists SET resampled = '$resampled' WHERE id = '$id' ");
				header("location: uploads/artists/".$resampled);
			}
			else{
				$resampled = uniqid().".png";
				
				file_put_contents("uploads/artists/".$resampled, file_get_contents($data['photo']));
				$img = new rodzImage("uploads/artists/".$resampled);
				$img->cropImage("uploads/artists/".$resampled);

				$db->query("UPDATE web_artists SET resampled = '$resampled' WHERE id = '$id' ");
				header("location: uploads/artists/".$resampled);
			}
		}
	}
}
elseif (isset($_POST['getArtistDetails'])) {
	$artist_id = (int)trim($_POST['getArtistDetails']);
	$user_id = (int)$_POST['user'];

	$data = $artist_data = $db->query("SELECT * FROM web_artists WHERE id = '$artist_id' ")->fetch_assoc();

	$songs = [];
	$read = $db->query("SELECT web_songs.id AS id, web_songs.title AS title, web_songs.resampled_artwork AS artwork, resampled_artwork, web_artists.name AS name, artist, downloads, plays,mp3_url FROM web_songs JOIN web_artists ON web_songs.artist = web_artists.id WHERE web_songs.artist = '$artist_id' ");
	while ($row = $read->fetch_assoc()) {
		$song_id = $row['id'];

		$row['featured'] = "";
		$row['artist_data'] = $artist_data;
        if ($row['artist_data'] != null) {
        	$row['comments'] = $db->query("SELECT * FROM comments WHERE song = '$song_id' ")->num_rows;
	        $row['artist'] = $row['artist_data']['name'];
			array_push($songs, $row);
        }
	}
	$data['followers'] = (int)$db->query("SELECT COUNT(id) AS count_all FROM followers WHERE artist = '$song_id' ")->fetch_assoc()['count_all'];
	$data['songs'] = $songs;
	$data['isFollowing'] = true;
	echo json_encode($data);
}
elseif (isset($_GET['redirectArtwork'])) {
	$song_id = (int)$_GET['redirectArtwork'];

	$data = $db->query("SELECT * FROM web_songs WHERE id = '$song_id' ")->fetch_assoc();
	$hasFile = false;
	if (strlen($data['resampled_artwork']) > 4) {
		if (file_exists("artwork/".$data['resampled_artwork'])) {
			$hasFile = true;
		}
	}

	if ($hasFile) {
		header("location: artwork/".$data['resampled_artwork']);
	}
	else{
		//download artwork
		header("location: artwork/icon.png");
	}
}
elseif (isset($_GET['redirectChartArtwork'])) {
	$id = (int)$_GET['redirectChartArtwork'];

	$data = $db->query("SELECT * FROM charts WHERE id = '$id' ")->fetch_assoc();
	if (file_exists("uploads/".$data['picture'])) {
		header("location: uploads/".$data['picture']);
		//echo $data['picture'];
	}
	else{
		header("location: artwork/icon.png");
	}
}
elseif(isset($_GET['redirectFullArtistPicture'])){
	$id = (int)$_GET['redirectFullArtistPicture'];

	$data = $db->query("SELECT * FROM web_artists WHERE id = '$id' ")->fetch_assoc();
	if (strpos($data['photo'], "http")) {
		//header("location: ".$data['photo']);
		echo $data['photo'];
	}
	else{
		if (file_exists("uploads/artists/".$data['photo'])) {
			header("location: uploads/artists/".$data['photo']);
		}
		else{
			header("location: images/pro_file.png");
		}
	}
}
elseif (isset($_GET['downloadSong'], $_GET['user'])) {
	$song_id = (int)$_GET['downloadSong'];
	$user = (int)$_GET['user'];

	$data = $db->query("SELECT * FROM web_songs WHERE id = '$song_id' ")->fetch_assoc();
	$db->query("UPDATE web_songs SET downloads  = downloads + 1 WHERE id = '$song_id' ");
	$db->query("UPDATE web_artists SET actions = actions + 1 WHERE id = '{$data['artist']}' ");
	//save all data
	Relations::userSong($db, $user,$song_id,$data['artist']);
	Relations::userArtist($db, $user,$song_id,$data['artist']);

	if ($data['website'] == "mdundo") {
		// code...
	}
	else{
		if (strpos(trim(strtolower($data['mp3_url'])), "http") === false) {
			//header("location: ".$data['mp3_url']);
			//strpos(haystack, needle)
			header("location: songs/".$data['mp3_url']);
		}
		else{
			//header("location: songs/".$data['mp3_url']);
			header("location: ".$data['mp3_url']);
		}
	}
}
elseif (isset($_POST['offlinePlays'], $_POST['user_type'], $_POST['data'])){
	file_put_contents('rodz.txt', $_POST['data']);
	echo json_encode(['status' =>true, 'message' => "Success"]);
}
elseif (isset($_POST['title_played'], $_POST['artist'], $_POST['user'], $_POST['user_type'])) {
	$title = $db->real_escape_string($_POST['title_played']);
	$artist_name = $db->real_escape_string($_POST['artist']);
	$user_id = (int)$_POST['user'];
	$type = $db->real_escape_string($_POST['user_type']);

	$ins = $db->query("INSERT INTO `local_song_plays`(`id`, `user`, `user_type`, `title`, `artist`, `time`, `progress`) VALUES (NULL, '$user_id', '$type','$title','$artist_name','$time', '100')");

	$check = $db->query("SELECT * FROM web_artists WHERE name = '$artist_name' ");
	if ($check->num_rows > 0) {
		$data = $check->fetch_assoc();
		$songs = (int)$db->query("SELECT COUNT(id) AS count_all FROM web_songs WHERE artist = '{$data['id']}' ")->fetch_assoc()['count_all'];

		echo json_encode([
			'artist_songs' => $songs,
			'status' => true,
			'artist_followers' => (int)$db->query("SELECT COUNT(id) AS count_all FROM followers WHERE artist = '{$data['id']}' ")->fetch_assoc()['count_all']
		]);
	}
	else{
		echo json_encode(['status' => false]);
	}
}
elseif (isset($_POST['findArtist'])) {
	$name = $db->real_escape_string($_POST['findArtist']);

	$read = $db->query("SELECT * FROM web_artists WHERE name = '$name' ");
	if ($read->num_rows > 0) {
		$data = $read->fetch_assoc();

		if (strlen($data['photo']) > 3) {
			$done = false;
			if (strlen($data['resampled']) > 0) {
				if (file_exists("uploads/artists/".$data['resampled'])) {
					$done = true;
				}
			}

			if ($done) {
				$data['status'] = true;
				echo json_encode($data);
			}
			else{
				//make the resampled picture
				$filename = rand(10001,90009)."_".rand(10001,90009).".png";

				if (Strings::contains($data['photo'], "http://") OR Strings::contains($data['photo'], "https://")) {
					file_put_contents("uploads/artists/".$filename, file_get_contents($data['photo']));
				}
				else{
					copy("uploads/artists/".$data['photo'], "uploads/artists/".$filename);
				}

				$img = new rodzImage("uploads/artists/".$filename);
				$img->cropImage("uploads/artists/".$filename);

				$db->query("UPDATE web_artists SET resampled = '$filename' WHERE id = '{$data['id']}' ");
				$data['status'] = true;
				$data['resampled'] = $filename;
				echo json_encode($data);
			}
		}
		else{
			$data['status'] = true;
			$data['resampled'] = 'default';
			echo json_encode($data);
		}
	}
	else{
		echo json_encode(['status' => false, 'message' => "Not found"]);
	}
}
elseif (isset($_POST['phoneStartLogin'])) {
	$phone = $db->real_escape_string($_POST['phoneStartLogin']);
	$sql = $db->query("SELECT * FROM users WHERE email = '$phone' OR phone = '$phone' ");
	if ($sql->num_rows > 0) {
		$data = $sql->fetch_assoc();
		echo json_encode(['type' => 'login', 'phone' => $phone, 'name' => $data['name'], 'status' => true]);
	}
	else{
		//new member
		echo json_encode(['type' => 'register', 'phone' => $phone, 'status' => true]);
	}
}
elseif (isset($_POST['register_phone'], $_POST['name'], $_POST['password'])) {
	$phone = $db->real_escape_string($_POST['register_phone']);
	$name = $db->real_escape_string($_POST['name']);
	$password = md5($_POST['password']);

	if (filter_var($phone, FILTER_VALIDATE_EMAIL)) {
		$email = $phone;
		$phone = "";
	}
	else{
		$email = "";
	}

	$code = rand(10001,90009);

	$ins = $db->query("INSERT INTO `users`(`id`, `email`, `phone`, `name`, `password`, `time_reg`, `status`, `code`, `photo`, `type`, `coordinates`, `location`, `country`) VALUES (NULL, '$email', '$phone', '$name', '$password', '$time', 'active', '$code', 'pro_file.png','user', '', '', '91')");
	$id = $db->insert_id;
	$data = $db->query("SELECT * FROM users WHERE id = '$id' ")->fetch_assoc();
	$data['status'] = true;

	$title = "Amuze Register";
    $content = "$name has registered in amuzee --".date('r');
    EndPoint::saveNotification($title, $content, "", "AMUZE_REGISTER");

	setcookie("logged_user_id", $data['id'], time()+(3600*24*30));

	$_SESSION['user'] = $data;
    $_SESSION['has_logged_in'] = $data['id'];
    $_SESSION['user_id'] = $data['id'];

	echo json_encode($data);
}
elseif (isset($_POST['phoneLogin'],$_POST['password'])) {
	$phone = $db->real_escape_string($_POST['phoneLogin']);
	$password = md5($_POST['password']);

	$sql = $db->query("SELECT * FROM users WHERE email = '$phone' AND password = '$password' AND email != '' OR phone = '$phone' AND password = '$password' AND phone != '' ");
	if ($sql->num_rows > 0) {
		$data = $sql->fetch_assoc();
		$data['status'] = true;
		setcookie("logged_user_id", $data['id'], time()+(3600*24*30));

		$_SESSION['user'] = $data;
        $_SESSION['has_logged_in'] = $data['id'];
        $_SESSION['user_id'] = $data['id'];

		echo json_encode($data);
	}
	else{
		echo json_encode(['status' => true, 'message' => "Password is incorrect"]);
	}
}
elseif (isset($_GET['getUserPicture'])) {
	$user_id = (int)$_GET['getUserPicture'];

	$data = $db->query("SELECT * FROM users WHERE id = '$user_id' ")->fetch_assoc();
	if ($data != null) {
		if (file_exists("profiles/".$data['photo'])) {
			header("location: profiles/".$data['photo']);
		}
		else{
			header("location: profiles/pro_file.png");
		}
	}
	else{
		header("location: profiles/pro_file.png");
	}
}
elseif (isset($_POST['songDownload'], $_POST['user'])) {
	$song_id = (int)$_POST['songDownload'];
	$user = (int)$_POST['user'];

	//increment downloads
	$data = $db->query("SELECT * FROM web_songs WHERE id = '$song_id' ")->fetch_assoc();
	$artist_id = $data['artist'];

	$db->query("UPDATE web_songs SET downloads  = downloads + 1 WHERE id = '$song_id' ");
	$db->query("UPDATE web_artists SET actions = actions + 1 WHERE id = '{$data['artist']}' ");

	//save user artist relations
	Relations::userArtist($db, $user,$artist_id);

	//save user song relations
	Relations::userSong($db, $user, $song_id, $artist_id);

	if(Strings::contains($data['mp3_url'], "http")){
		$mp3_url = $data['mp3_url'];
	}
	else{
		$mp3_url = "https://amuzeemw.com/songs/".$data['mp3_url'];
	}

	echo json_encode(['status' => true, 'mp3_url' => $mp3_url]);
}
elseif (isset($_POST['followArtist'], $_POST['user'], $_POST['user_type'])) {
	$artist_id = (int)$_POST['followArtist'];
	$user = (int)$_POST['user'];

	$check = $db->query("SELECT * FROM followers WHERE artist = '$artist_id' AND user = '$user' ");
	if ($check->num_rows == 0) {
		$ins = $db->query("INSERT INTO `followers`(`id`, `user`, `artist`, `since`) VALUES (NULL, '$user', '$artist_id', '$time')");

		$db->query("UPDATE web_artists SET actions = actions + 1 WHERE id = '$artist_id' ");

		//save user artist relations
		$check = $db->query("SELECT * FROM user_artist WHERE user = '$user' AND artist = '$artist_id' ");
		if ($check->num_rows > 0) {
			$db->query("UPDATE user_artist SET value = value + 1 WHERE user = '$user' AND artist = '$artist_id' ");
		}
		else{
			$db->query("INSERT INTO `user_artist`(`id`, `user`, `artist`, `value`) VALUES (NULL, '$user', '$artist_id', '1')");
		}
		$followers = (int)$db->query("SELECT COUNT(id) AS count_all FROM followers WHERE artist = '$artist_id' ")->fetch_assoc()['count_all'];
		echo json_encode(['status' => true, 'isFollowing' => true, 'followers' => $followers]);
	}

	else{
		$db->query("DELETE FROM followers WHERE artist = '$artist_id' AND user = '$user' ");
		$db->query("DELETE FROM user_artist WHERE artist = '$artist_id' AND user = '$user' ");
		$followers = (int)$db->query("SELECT COUNT(id) AS count_all FROM followers WHERE artist = '$artist_id' ")->fetch_assoc()['count_all'];
		echo json_encode(['status' => true, 'isFollowing' => false, 'followers' => $followers]);
	}
}
elseif (isset($_POST['saveSearch'], $_POST['user'], $_POST['word'], $_POST['ref'])) {
	$type = $db->real_escape_string($_POST['saveSearch']);
	$user_id = (int)$_POST['user'];
	$word = $db->real_escape_string($_POST['word']);
	$ref = (int)$_POST['ref'];

	//check if already
	$check = $db->query("SELECT * FROM previous_searches WHERE user = '$user' AND type = '$type' AND ref = '$ref' ");
	if ($check->num_rows > 0) {
		//update the last time
		$data = $check->fetch_assoc();
		$db->query("UPDATE previous_searches SET last_time = '$time' WHERE id = '{$data['id']}' ");
	}
	else{
		$ins = $db->query("INSERT INTO `previous_searches`(`id`, `user`, `ref`, `data`, `last_time`, `type`) VALUES (NULL, '$user_id', '$ref', '$word', '$time', '$type')");
	}

	echo json_encode(['status' => true, 'message' => "Success"]);
}
elseif (isset($_POST['likeSong'], $_POST['user'])) {
	$song_id = (int)$_POST['likeSong'];
	$user_id = $user = (int)$_POST['user'];

	//increment downloads
	$data = $db->query("SELECT * FROM web_songs WHERE id = '$song_id' ")->fetch_assoc();
	$artist_id = $data['artist'];

	//$db->query("UPDATE web_songs SET downloads  = downloads + 1 WHERE id = '$song_id' ");
	$db->query("UPDATE web_artists SET actions = actions + 1 WHERE id = '{$data['artist']}' ");

	//save user artist relations
	$check = $db->query("SELECT * FROM user_artist WHERE user = '$user' AND artist = '$artist_id' ");
	if ($check->num_rows > 0) {
		$db->query("UPDATE user_artist SET value = value + 1 WHERE user = '$user' AND artist = '$artist_id' ");
	}
	else{
		$db->query("INSERT INTO `user_artist`(`id`, `user`, `artist`, `value`) VALUES (NULL, '$user', '$artist_id', '1')");
	}

	//save user song relations
	$check = $db->query("SELECT * FROM user_song WHERE user = '$user' AND song = '$song_id' ");
	if ($check->num_rows > 0) {
		$db->query("UPDATE user_song SET value = value + 1 WHERE user = '$user' AND song = '$song_id' ");
	}
	else{
		$db->query("INSERT INTO `user_song`(`id`, `user`, `song`, `value`,`artist`) VALUES (NULL, '$user', '$song_id', '1', '$artist_id')");
	}

	//check if has liked the song
	$hasLiked = true;
	$check = $db->query("SELECT * FROM likes WHERE song = '$song_id' AND user = '$user' ");
	if ($check->num_rows) {
		$db->query("DELETE FROM likes  WHERE song = '$song_id' AND user = '$user' ");
		$hasLiked = false;
	}
	else{
		$db->query("INSERT INTO `likes`(`id`, `user`, `song`) VALUES (NULL, '$user', '$song_id')");
	}
	$likes = $db->query("SELECT * FROM likes WHERE song = '$song_id' ")->num_rows;

	echo json_encode(['status' => true, 'likes' => $likes, 'hasLiked' => $hasLiked]);
}
elseif (isset($_POST['updateResampledPicture64'],$_POST['file'])) {
	$song_id = (int)$_POST['updateResampledPicture64'];
	$filename = uniqid().uniqid().".png";

	file_put_contents("artwork/".$filename, base64_decode($_POST['file']));

	$db->query("UPDATE web_songs SET resampled_artwork = '$filename' WHERE id = '$song_id' ");
	echo json_encode(['status'=>true]);
}
elseif (isset($_POST['updateSongDuration'])) {
	$song_id = (int)$_POST['updateSongDuration'];
	$duration = $db->real_escape_string($_POST['duration']);

	$db->query("UPDATE web_songs SET length = '$duration' WHERE id = '$song_id' ");
	echo json_encode(['status'=>true]);
}
elseif (isset($_POST['send_feedback'],$_POST['user_type'], $_POST['content'])) {
	$content = $db->real_escape_string($_POST['content']);
	$user = (int)$_POST['send_feedback'];
	$type = $db->real_escape_string($_POST['user_type']);

	$ins = $db->query("INSERT INTO `feedback`(`id`, `user`, `user_type`, `type`, `message`, `dateAdded`) VALUES (NULL, '$user','$type', 'user', '$content', '$time')");
	echo json_encode(['status' => true]);
}
elseif (isset($_POST['get_feedback'],$_POST['user_type'])) {
	$user_id = (int)$_POST['get_feedback'];
	$type = $db->real_escape_string($_POST['user_type']);

	$data = [];
	$read = $db->query("SELECT * FROM feedback WHERE user = '$user_id' AND type = '$type' ");
	while($row = $read->fetch_assoc()){
		//$row['dateAdded'] = date('D d-M-Y H:i A', $row['dateAdded']);
		array_push($data, $row);
	}

	echo json_encode($data);
}
elseif (isset($_POST['checkVersion'])) {
	echo json_encode(['status' => true]);
}
elseif (isset($_FILES['uploadProfile'], $_POST['user_id'])) {
	$filename = $_FILES['uploadProfile']['name'];

	$user_id = (int)$_POST['user_id'];

	if (move_uploaded_file($_FILES['uploadProfile']['tmp_name'], "profiles/".$filename)) {
		$img = new rodzImage("profiles/".$filename);
		$img->cropImage("profiles/".$filename);

		$db->query("UPDATE users SET photo = '$filename' WHERE id = '$user_id' ");
		echo json_encode(['status' => true, 'filename' => $filename]);
	}
	else{
		echo json_encode(['status' => false, 'message' => "Failed to upload file"]);
	}
}
elseif (isset($_POST['change_profile_photo'], $_POST['file_picture'], $_POST['filename'])) {
	$id = (int)$_POST['change_profile_photo'];

	file_put_contents("profiles/".$_POST['filename'], base64_decode($_POST['file_picture']));

	$img = new rodzImage("profiles/".$_POST['filename']);
	$img->cropImage("profiles/".$_POST['filename']);
	$filename = $_POST['filename'];

	$db->query("UPDATE users SET photo = '$filename' WHERE id = '$id' ");

	echo json_encode(['status' => true, 'picture' => $filename]);
}
elseif (isset($_POST['hateThis'])) {
	$song_id = (int)trim($_POST['hateThis']);
	$user_id = $user = (int)trim($_POST['user_id']);
	$data = $db->query("SELECT * FROM web_songs WHERE id = '$song_id' ")->fetch_assoc();
	$artist_id = $data['artist'];

	//delete 
	$db->query("DELETE FROM user_artist WHERE artist = '$artist_id' AND user = '$user' ");
	$db->query("DELETE FROM user_song WHERE song = '$song_id' AND user = '$user' ");

	$ins = $db->query("INSERT INTO `dislike`(`id`, `user`, `item`, `type`) VALUES (NULL, '$user', '$song_id', 'song')");
	$ins = $db->query("INSERT INTO `dislike`(`id`, `user`, `item`, `type`) VALUES (NULL, '$user', '$artist_id', 'artist')");
}
elseif (isset($_POST['getListSongs'])) {
	$list_id = (int)$_POST['getListSongs'];

	//get list of artists
	$artists = [];
	$song_ids = [];
	$read = $db->query("SELECT artist,song FROM play_list_songs JOIN web_songs ON play_list_songs.song = web_songs.id WHERE play_list_songs.chart = '$list_id' ");
	while ($row = $read->fetch_assoc()) {
		array_push($artists, $row['artist']);
		array_push($song_ids, $row['song']);
	}

	if (count($artists) > 0) {
		$read = $db->query("SELECT * FROM web_artists WHERE id IN (".implode(",", $artists).")");
		$artists = [];
		while ($row = $read->fetch_assoc()) {
			$artists[$row['id']] = $row;
		}
	}

	$read = $db->query("SELECT * FROM web_songs WHERE id IN (".implode(",",$song_ids).") ");
	$song_list = [];
    while ($row = $read->fetch_assoc()) {
    	$row['song_id'] = $row['id'];
        $row['artist_data'] = $artists[$row['artist']];
        $row['artist'] = $row['artist_data']['name'];
        array_push($song_list, $row);
    }
	
	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($song_list);
}
elseif (isset($_POST['getChartSongs'])) {
	$list_id = (int)$_POST['getChartSongs'];

	//get list of artists
	$artists = [];
	$song_ids = [];
	$read = $db->query("SELECT artist,song FROM chart_list JOIN web_songs ON chart_list.song = web_songs.id WHERE chart = '$list_id' ");
	while ($row = $read->fetch_assoc()) {
		array_push($artists, $row['artist']);
		array_push($song_ids, $row['song']);
	}

	if (count($artists) > 0) {
		$read = $db->query("SELECT * FROM web_artists WHERE id IN (".implode(",", $artists).")");
		$artists = [];
		while ($row = $read->fetch_assoc()) {
			$artists[$row['id']] = $row;
		}
	}

	$read = $db->query("SELECT * FROM web_songs WHERE id IN (".implode(",",$song_ids).") ");
	$song_list = [];
    while ($row = $read->fetch_assoc()) {
    	$row['song_id'] = $row['id'];
        $row['artist_data'] = $artists[$row['artist']];
        $row['artist'] = $row['artist_data']['name'];
        array_push($song_list, $row);
    }
	
	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($song_list);
}
elseif (isset($_POST['countriesTopSongs'])) {
	$songs = [];
	$artists = [];
	$song_artist = [];
	$artist_song = [];
	$song_plays = [];

	$read = $db->query("SELECT DISTINCT id,artist FROM web_songs ORDER BY plays DESC LIMIT 5000");
	while ($row = $read->fetch_assoc()) {
		array_push($songs, $row['id']);
		array_push($artists, $row['artist']);

		$song_artist[$row['id']] = $row['artist'];
		$artist_song[$row['artist']] = $row['id'];
	}

	$byCountries = Artists::byCountries($db, $artists);
	$countries_id = array_keys($byCountries);
	$countries = [];
	$read = $db->query("SELECT id,name FROM countries WHERE id IN (".implode(",", $countries_id).")");
	while ($row = $read->fetch_assoc()) {
		$countries[$row['id']] = $row['name'];
	}
	$countries[0] = "Not known";

	$mega = [];
	$selected_artists = [];

	for ($i=0; $i < count($songs); $i++) { 
		$artist_id = $song_artist[$songs[$i]];

		$country = Artists::findCountry($artist_id, $byCountries);
		if (isset($mega[$country])) {
			if (count($mega[$country]) < 30) {
				array_push($mega[$country], $songs[$i]);
			}
		}
		else{
			$mega[$country] = [$songs[$i]];
			array_push($selected_artists, $artist_id);
		}
	}

	$artist_store = [];
    if(count($selected_artists) > 0){
        $read = $db->query("SELECT * FROM web_artists WHERE id IN (".implode(",",$artists).")");
        while ($row = $read->fetch_assoc()) {
            $artist_store[$row['id']] = $row;
        }
    }

	$data = [];
	foreach ($mega as $country_id => $song_ids) {
		if (count($data) < 8) {
			$row1['label'] = $countries[$country_id];
			//$row['artwork'] = 
			$songs = [];
			$read = $db->query("SELECT * FROM web_songs WHERE artist != '0' AND id IN (".implode(",",$song_ids).") ORDER BY plays DESC");
	        while ($row = $read->fetch_assoc()) {
	        	$row['song_id'] = $row['id'];
	            $row['artist_data'] = $artist_store[$row['artist']];
	            $row['artist'] = $row['artist_data']['name'];
	            
	            array_push($songs, $row);
	        }
	        $row1['artwork'] = $songs[0]['resampled_artwork'];
	        $row1['songs'] = $songs;
	        array_push($data,$row1);
	    }
	}

	echo json_encode($data);
}
elseif (isset($_POST['savePlaylist'], $_POST['user'])) {
	$user = (int)$_POST['user'];
	$ids = explode(",", $_POST['savePlaylist']);

	$ref = Crypto::letters_numbers(32);
	$ins = "INSERT INTO `playlists`(`id`, `user`, `ref`, `song`, `status`) VALUES ";
	$values = [];
	foreach ($ids as $id) {
		$status = count($values) == 0 ? "active" : "saved";
		array_push($values, "(NULL,'$user', '$ref','$id','$status')");
	}

	$db->query($ins.implode(", ", $values).";");
	echo "List was saved!";
}
elseif (isset($_POST['updateListActive'], $_POST['user'])) {
	$song_id = (int)$_POST['updateListActive'];
	$user = (int)$_POST['user'];

	$check = $db->query("SELECT DISTINCT ref FROM playlists WHERE user = '$user' ORDER BY id DESC LIMIT 0,1 ");
	if ($check->num_rows > 0) {
		$ref = $check->fetch_assoc()['ref'];

		$db->query("UPDATE playlists SET status = 'saved'  WHERE user = '$user' AND ref = '$ref' ");
		$db->query("UPDATE playlists SET status = 'active'  WHERE user = '$user' AND ref = '$ref' AND song = '$song_id' ");
		echo "Index updated";
	}
	else{
		echo "no list found";
	}
}
elseif (isset($_POST['getLastList'])) {
	$user_id = $user = (int)$_POST['getLastList'];

	$check = $db->query("SELECT DISTINCT ref,id FROM playlists WHERE user = '$user' ORDER BY id DESC LIMIT 0,1 ");
	if ($check->num_rows > 0) {
		$ref = $check->fetch_assoc()['ref'];

		$playIndex = 0;
		$songs = [];

		$read1 = $db->query("SELECT web_songs.id,web_songs.title, mp3_url, artwork, artist, resampled_artwork, name,playlists.status,ref FROM playlists JOIN web_songs ON playlists.song = web_songs.id JOIN web_artists ON web_songs.artist = web_artists.id WHERE ref = '$ref' ");
		$names = [];
		$i = 0;
		while ($row1 = $read1->fetch_assoc()) {
			$row1['song_id'] = $row1['id'];
			$artist_data = $db->query("SELECT * FROM web_artists WHERE id = '{$row1['artist']}' ")->fetch_assoc();
			if ($artist_data != null) {
				$row1['artist_data'] = $artist_data;
				
				array_push($songs, $row1);
			}
			if ($row1['status'] == "active") {
				$playIndex = $i;
			}
			$i += 1;
		}

		echo json_encode(['status' => true, 'playIndex' => $playIndex, 'playlist' => $songs]);
	}
	else{
		echo json_encode(['status' => false, 'message' => "List not found"]);
	}
}
elseif(isset($_POST['addFav'], $_POST['type'], $_POST['user'])){
	$ref = (int)$_POST['addFav'];
	$type = $db->real_escape_string($_POST['type']);
	$user = (int)$_POST['user'];

	$check = $db->query("SELECT * FROM favourites WHERE type = '$type' AND user = '$user' AND ref = '$ref' ");
	if ($check->num_rows > 0) {
		$data = $check->fetch_assoc();
		$upd = $db->query("UPDATE favourites SET time = '$time' WHERE id = '{$data['id']}' ");
		echo "Updated time";
	}
	else{
		$ins = $db->query("INSERT INTO `favourites`(`id`, `user`, `type`, `ref`,`time`) VALUES (NULL, '$user', '$type', '$ref', '$time')");
		echo "saved new record";
	}
}
elseif (isset($_POST['saveSearch'], $_POST['type'], $_POST['ref'])) {
	$user = (int)$_POST['saveSearch'];
	$type = $db->real_escape_string($_POST['type']);
	$ref = $db->real_escape_string($_POST['ref']);

	$ins = $db->query("INSERT INTO `search_history`(`id`, `user`, `ref`, `type`, `time`) VALUES (NULL, '$user', '$ref', '$type', '$time')");
	echo "saved search history";
}
elseif (isset($_POST['getSearchHistory'])) {
	$user_id = (int)$_POST['getSearchHistory'];

	$songs = [];
	$sql = $db->query("SELECT * FROM web_songs WHERE id IN (SELECT ref FROM search_history WHERE user = '$user_id' AND type = 'song')");
	while ($row = $sql->fetch_assoc()) {
		$row['song_id'] = $row['id'];
		$row['artist_data'] = $db->query("SELECT * FROM web_artists WHERE id = '{$row['artist']}' ")->fetch_assoc();
		$row['name'] = $row['artist_data']['name'];
		$songs[$row['id']] = $row;
	}

	$artists = [];
	$sql = $db->query("SELECT * FROM web_artists WHERE id IN (SELECT ref FROM search_history WHERE user = '$user_id' AND type = 'artist')");
	while ($row = $sql->fetch_assoc()) {
		$artists[$row['id']] = $row;
	}

	$rows = [];

	$read = $db->query("SELECT * FROM search_history WHERE user = '$user_id' ORDER BY id DESC");
	while ($row = $read->fetch_assoc()) {
		$row['data'] = $row['type'] == "song" ? $songs[$row['ref']] : $artists[$row['ref']];
		array_push($rows, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($rows);
}
elseif (isset($_POST['getPendingYoutube'])) {
	$read = $db->query("SELECT * FROM pending_youtube WHERE status != 'done' LIMIT 1 ");
	if ($read->num_rows > 0) {
		$data = $read->fetch_assoc();
		$db->query("UPDATE pending_youtube SET status = 'started' WHERE id = '{$data['id']}' ");
		$data['status'] = true;
		echo json_encode($data);
	}
	else{
		echo json_encode(['status' => false, 'message' => "Empty"]);
	}
}
elseif (isset($_POST['vid'], $_POST['user'])) {
	// perform the necessary check...
	$vid = $_POST['vid'];
	$db3 = new mysql_like("crawling/youtube/youtube.db3");
	$link = "https://www.youtube.com/watch?v=".$vid;
	$user = (int)$_POST['user'];

	$check1 = $db->query("SELECT * FROM pending_youtube WHERE vid = '$vid' ");
	if ($check1->num_rows > 0) {
		$data = $check1->fetch_assoc();
		if ($data['status'] != "saved") {
			$data['song'] = $db->query("SELECT * FROM web_songs WHERE id = '{$data['song']}' ")->fetch_assoc();
			$artist_id = $data['song']['artist'];
			$data['song']['artist_data'] = $db->query("SELECT * FROM web_artists WHERE id = '$artist_id' ")->fetch_assoc();
			$data['song']['name'] = $data['song']['artist_data']['name'];
			$data['song']['song_id'] = $data['song']['id'];
			$data['mode'] = "already";
			$data['status'] = true;
			echo json_encode($data);
		}
		else{
			echo json_encode(['status' => true, 'message' => "Music Already added to queue"]);
		}
	}
	else{
		$text = file_get_contents("https://www.googleapis.com/youtube/v3/videos?part=id%2C+snippet&id=".$vid."&key=AIzaSyAck-gqiy9ok-TFim33Ob6WZe_fKNN3GH8");

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
					//$save = $db3->query("INSERT INTO links (id,link,artist,title,artwork,year,mp3_url,status,vid) VALUES (NULL, '$link', '{$data['artist']}', '{$data['title']}', '{$data['artwork']}', '{$data['year']}', '', 'saved', '{$data['vid']}')");
					$ins = $db->query("INSERT INTO `pending_youtube`(`id`, `user`, `vid`, `time`, `status`, `song`,  `artist`, `artwork`, `title`, `year`) VALUES (NULL, '$user','$vid', '$time', 'saved', '0', '{$data['artist']}', '{$data['artwork']}', '{$data['title']}', '{$data['year']}')");

					echo json_encode(['status' => true,'type' => 'link', 'mode' => 'onqueue', 'vid' => $data['vid']]);
				}
				else{
					echo json_encode(['status' => false, 'message' => "Already added to queue!"]);
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
}
elseif (isset($_POST['extractedYoutube'], $_POST['vid'])) {
	$vid = $db->real_escape_string($_POST['vid']);
	$video_data = $db->query("SELECT * FROM pending_youtube WHERE vid = '$vid' ")->fetch_assoc();
	try{
		$data = json_decode($_POST['extractedYoutube'], true);

		if (isset($data['url'])) {
			$filename = uniqid().'.mp3';

			file_put_contents('songs/'.$filename, file_get_contents($data['url']));

			$title = $db->real_escape_string($video_data['title']);
			$name = $db->real_escape_string($video_data['artist']);
			$artist_id = 0;
			$read = $db->query("SELECT * FROM web_artists WHERE name LIKE '$name' ");
			if ($read->num_rows > 0) {
				// already added...
				$artist_id = $read->fetch_assoc()['id'];
			}
			else{
				//save
				$ins = $db->query("INSERT INTO `web_artists`(`id`, `webid`, `name`, `photo`, `resampled`, `biography`, `status`, `link`, `website`, `country`) VALUES (NULL, '0', '$name', '', '', '', 'active', '', '', '')");
				//echo json_encode(['status' => true, 'message' => "Added"]);
				$artist_id = $db->insert_id;
			}

			//save the audio
			$db->query("INSERT INTO `web_songs`(`id`, `webid`, `title`, `artist`, `album`, `length`, `artwork`, `resampled_artwork`, `mp3_url`, `dateAdded`, `genre`, `website`, `status`, `plays`, `downloads`, `color`, `small_art`, `year`) VALUES (NULL, '$vid', '$title', '$artist_id', '0', '', '{$video_data['artwork']}', '', '$filename', '$time', '0', '', 'active', '0', '0', '', '', '{$video_data['year']}')");
			$song_id = $db->insert_id;
			$db->query("UPDATE pending_youtube SET status = 'done', song = '$song_id' WHERE vid = '$vid'  ");
			echo json_encode(['status' => true, 'message' => "Songs added"]);
		}
		else{
			echo "Url not found";
		}
	}
	catch(Exception $e){
		echo $e->getMessage();
	}
}
elseif (isset($_POST['checkCompleted'])) {
	$vid = $db->real_escape_string($_POST['checkCompleted']);

	$check = $db->query("SELECT * FROM pending_youtube WHERE vid = '$vid' ");
	if ($check->num_rows > 0) {
		$data = $check->fetch_assoc();
		if ($data['status'] == "done") {
			$data['song'] = $db->query("SELECT * FROM web_songs WHERE id = '{$data['song']}' ")->fetch_assoc();
			$artist_id = $data['song']['artist'];
			$data['song']['artist_data'] = $db->query("SELECT * FROM web_artists WHERE id = '$artist_id' ")->fetch_assoc();
			$data['song']['name'] = $data['song']['artist_data']['name'];
			$data['song']['song_id'] = $data['song']['id'];
			$data['mode'] = "already";
			$data['status'] = 'done';
			echo json_encode($data);
		}
		else{
			echo json_encode(['status' => $data['status'], 'message' => "Music Already added to queue"]);
		}
	}
	else{
		echo json_encode(['status' => 'false']);
	}
}

elseif (isset($_POST['saveDialogLaunch'])) {
	$user = $_COOKIE['user_id'];

	$ins = $db->query("INSERT INTO `first_launch`(`id`, `user`, `time`) VALUES (NULL, '$user', '$time')");
	echo json_encode(['status' => true, 'message' => "Success"]);
}
else{
	echo "No data";
	var_dump($_POST);
}