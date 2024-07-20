<?php 
//$db = new mysqli("localhost", "root", "password", "copying");
require '../../db.php';
require 'malawi.php';
require '../../includes/EndPoint.php';

$index = (int)file_get_contents("current.txt");
if($index > 0){
	$url = "https://m.malawi-music.com/download/index.php?song=".$index;
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

	$str = $headers['content-disposition'][0];

	$str2 = substr($str, strpos($str, '"'));
	$str2 = str_replace('"', '', $str2);
	$str2 = str_replace('.mp3', '', $str2);

	$chars = explode("-", $str2);
	$artist = trim($chars[0]);
	$title = trim($chars[1]);


	//perform search
	$text = file_get_contents("http://www.malawi-music.com/search.php?term=".$title);
	
	if($text != ""){
    	$doc = new DOMDocument();
    	$doc->loadHTML($text);
    
    	$links2 = [];
    
    	foreach($doc->getElementsByTagName('div') as $div){
    		if ($div->getAttribute('class') == "card-body") {
    			// get artist link and album link...
    
    			$links = $div->getElementsByTagName("a");
    			if (count($links) == 2) {
    				$first = $links->item(0);
    				$second = $links->item(1);
    
    				if (trim($first->nodeValue) == $artist) {
    					$links2['artist'] = $first->getAttribute('href');
    					$links2['album'] = $second->getAttribute('href');
    				}
    			}
    		}
    	}
    
    	if ($links2['artist'] != "") {
	    	$artist_page = file_get_contents($links2['artist']);
	    	$malawi = new MalawiMusic($artist_page);
	    
	    	$artist_data = $malawi->getArtist();
	    	$artist_id = $artist_data['webid'];
	    	//check 
	    	$check = $db->query("SELECT * FROM mw_artists WHERE webid = '{$artist_data['webid']}' ");
	    	if ($check->num_rows == 0) {
	    		$artist_name = $db->real_escape_string($artist_data['name']);
	    		$artist_photo = $db->real_escape_string($artist_data['image']);
	    
	    		$ins = $db->query("INSERT INTO `mw_artists`(`id`, `webid`, `name`, `photo`, `biography`, `status`, `link`) VALUES (NULL, '{$artist_data['webid']}', '$artist_name', '$artist_photo', '', 'active', '{$links2['artist']}')");
	    
	    		if ($ins) {
	    			//save the artist
	    			echo EndPoint::saveSong([
	    				'country' => "Malawi",
	    				'photo' => $artist_data['image'],
	    				'name' => $artist_name,
	    				'link'=> $links2['artist'],
	    				'website' => "malawimusic"
	    			]);
	    			// get and save all albums...
	    
	    			foreach($artist_data['albums'] as $album){
	    				$album_name = $db->real_escape_string($album['name']);
	    				$album_image = $db->real_escape_string($album['image']);
	    				$db->query("INSERT INTO `mw_album`(`id`, `name`, `webid`, `link`, `artist`, `image`, `status`) VALUES (NULL, '$album_name', '{$album['webid']}', '{$album['link']}', '{$artist_data['webid']}', '$album_image', 'notyet')");
	    			}
	    		}
	    		else{
	    			echo $db->error;
	    		}
	    	}
	    }
	}

	//read albums
	$read = $db->query("SELECT * FROM mw_album WHERE status = 'notyet' LIMIT 1");
	while ($row = $read->fetch_assoc()) {
		$html = file_get_contents($row['link']);
		$album_id = $row['webid'];

        if($html != ""){
    		$doc = new DOMDocument();
    		$doc->loadHTML($html);
    
    		foreach($doc->getElementsByTagName("div") as $div){
    			if ($div->getAttribute("class") == "col-sm-6") {
    				foreach($div->getElementsByTagName("span") as $span){
    					$a = $span->getElementsByTagName("a")->item(0);
    					if ($a != null) {
    						$link = $a->getAttribute('href');
    
                            if($link != ""){
                            	//check the web id
                            	$chs = explode("/", $link);
                            	$webid = explode("-", $chs[count($chs)-1])[0];
    
                            	$chec = $db->query("SELECT * FROM mw_songs WHERE webid = '$webid' ");
        	    				if ($chec->num_rows == 0) {
    	    						$mw = new MalawiMusic(file_get_contents($link));
    	    						$song = $mw->getSong();
    	    						
    	    						if($song != null){
    	    	    					//save the song
    	    	    					
    		    						$song_name = $db->real_escape_string($song['name']);
    		    						$mp3_url = $db->real_escape_string($song['mp3_url']);
    		    						$song_image = $db->real_escape_string($song['image']);
    		    
    		    						$ins = $db->query("INSERT INTO `mw_songs`(`id`, `webid`, `title`, `artist`, `album`, `length`, `artwork`, `mp3_url`, `dateAdded`, `genre`) VALUES (NULL, '{$song['webid']}', '$song_name', '$artist_id', '$album_id', '{$song['meta']['Length']}', '$song_image', '$mp3_url', '{$song['meta']['Added on']}', '{$song['meta']['Genre']}')");
    		    						echo EndPoint::saveSong([...$song, 'country'=> "Malawi", "website" => "malawimusic"]);
    
    		    						if (!$ins) {
    		    							echo $db->error;
    		    						}
    	    						}
    	    						else{
    	    						    echo "null ".$link;
    	    						}
    	    					}
                            }
    					}
    				}
    			}
    		}
		}
		$db->query("UPDATE mw_album SET status = 'done' WHERE webid = '$album_id' ");
	}
	echo "<h1>$index</h2>";
	file_put_contents("current.txt", ($index-1));
	?>
	<script type="text/javascript">
		window.onload = function(event) {
			var reload = function() {
				window.location = 'index.php';
			}

			setTimeout(reload, 300);
		}
	</script>
	<?php
}
else{
    echo "Finished";
}
?>