<?php
error_reporting(E_ERROR | E_PARSE);
require '../../includes/String.php';
require '../../includes/EndPoint.php';

function saveArtistAndSongs($data)
{
	$ch = curl_init(); 
    curl_setopt($ch, CURLOPT_URL, "https://amuzeemw.com/endpoint/artistAndSongs"); 
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Content-Type:application/json'
    )); 
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);   
    curl_setopt($ch, CURLOPT_POST, 1); 
    curl_setopt($ch, CURLOPT_POSTFIELDS,  json_encode($data)); 
    //curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
    $response = curl_exec($ch);
    //file_put_contents('response.txt', $response);
    //$output = json_decode($response); 
    return $response;
}

$current = (int)file_get_contents("current.txt");
if ($current > 0) {
	//file_put_contents('artist.html', file_get_contents("https://mdundo.com/a/148408"));
	$text = file_get_contents("https://mdundo.com/a/".$current);
	//$text = file_get_contents('artist.html');

	$dom = new DOMDocument();
	$dom->loadHTML($text);
	$data = [];
	$data['songs'] = [];

	foreach ($dom->getElementsByTagName("div") as $div) {
		if ($div->getAttribute("class") == "single-artist-page_wrapper") {
			$img = $div->getElementsByTagName("img")->item(0);
			if ($img != null) {
				$data['photo'] = $img->getAttribute("src");
			}
			//$data['found'] = 'me';
			$h1 = $div->getElementsByTagName("h1")->item(0);
			if ($h1 != null) {
				$data['name'] = $h1->nodeValue;
			}
		}

		if ($div->getAttribute("class") == "b-description__text") {
			$data['biography'] = $div->nodeValue;
		}
	}

	//find songs

	foreach ($dom->getElementsByTagName("ul") as $ul) {
		if ($ul->getAttribute("id") == "song_list") {
			foreach ($ul->getElementsByTagName("li") as $li) {
				$song = [];
				$a = $li->getElementsByTagName("a")->item(0);
				if ($a != null) {
					$dl = $a->getAttribute("href");
					$chars = explode("/", $dl);
					$song['mp3_url'] = "https://mdundo.com/stream/".$chars[count($chars)-1];
					$song['webid'] = $chars[count($chars)-1];
				}

				foreach ($li->getElementsByTagName("span") as $span) {
					if ($span->getAttribute("class") == "song-title") {
						$song['title'] = $span->nodeValue;
					}

					if ($span->getAttribute("class") == "song-time stream_off") {
						$song['duration'] = $span->nodeValue;
					}
				}
				$div = $li->getElementsByTagName("div")->item(0);
				if ($div != null) {
					$genre = trim(htmlspecialchars_decode($div->nodeValue));
					$song['genre'] = trim(Strings::filterAlphabetAndSpace(str_replace("#", "", $genre)));
				}

				array_push($data['songs'], $song);
			}
		}
	}

	//header('Content-Type: application/json; charset=utf-8');
	//echo json_encode($data);
	echo saveArtistAndSongs($data);
	file_put_contents('current.txt', ($current-1));
}
else{
	echo "Probably finished!!";
}
?>