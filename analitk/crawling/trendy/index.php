<?php 
error_reporting(E_ERROR | E_PARSE);
require '../../functions.php';
require '../../includes/String.php';
require '../../includes/EndPoint.php';

$db = new mysql_like("trendy.db3");

$time = time();

$c = $db->query("SELECT * FROM links WHERE status = 'saved' LIMIT 0,1 ");
if ($c->num_rows > 0) {
		
	$data = $c->fetch_assoc();
	$link_id = $data['id'];

	$url = $data['link'];
	$host = parse_url($url, PHP_URL_HOST);

	//error_reporting(0);
	try{
		$dom = new DOMDocument();
		$html = file_get_contents($data['link']);
		if ($html != false) {
			$dom->loadHTML($html);

			$domain_id = 2;

			$path = parse_url($url, PHP_URL_PATH);
			$is_nyimbo = false;

			if (strlen($path) > 5) {
				$path = substr($path, 1);
				$chars = explode("/", $path);

				if ($chars[0] == "download-mp3") {
					$is_nyimbo = true;
				}
			}

			if ($is_nyimbo) {
				//echo "is is_nyimbo";

				$artwork = "";
				$mp3_url = "";
				$title = "";
				$artist = "";

				$div = $dom->getElementById("tracktitle");
				if ($div != null) {
					$artwork = $div->getElementsByTagName("img")->item(0)->getAttribute("src");
					foreach($dom->getElementsByTagName("audio") as $audio){
						$mp3_url = $dom->getElementsByTagName("audio")->item(0)->getElementsByTagName("source")->item(0)->getAttribute("src");
					}
					$text = $div->getElementsByTagName("h1")->item(0)->nodeValue;
					$text = str_replace("| Download Music MP3", "", $text);
					$chars = explode("-", $text);

					$artist = $db->real_escape_string(trim($chars[0]));
					$title = $db->real_escape_string(trim($chars[1]));

					//check artist
					
					//save to web store
					$res = EndPoint::saveSong([
						'artist' => $artist,
						'title' => $title,
						'artwork' => $artwork,
						'mp3_url' => $mp3_url,
						'website' => "trendy",
						'country' => "nigeria"
					],[]);
					echo $res;
				}
				else{
					//do no thing
					echo "Target div not found";
				}
			}
			else{
				//echo "not";
			}

				
			foreach ($dom->getElementsByTagName("a") as $a) {
				$http_url = $a->getAttribute('href');
				$text = trim(trim($a->nodeValue));

				$host = parse_url($http_url, PHP_URL_HOST);
				if($host == "trendybeatz.com"){
					if ($db->query("SELECT * FROM links WHERE link = '$http_url' ")->num_rows < 1) {
						$ins = $db->query("INSERT INTO `links`(`id`, `link`, `text`, `status`) VALUES (NULL, '$http_url', '$text', 'saved')");
					}
				}
				else{
					//echo $host." - <br>";
				}
			}
		}
	}
	catch(Exception $ex){
		echo $ex->getMessage();
	}

	$db->query("UPDATE links SET status = 'used' WHERE id = '$link_id' ");

	echo " - $url";
}
else{
	echo "Probably finished";
}