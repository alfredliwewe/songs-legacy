<?php

//file_put_contents("one.html", file_get_contents("https://www.naijaloaded.com.ng/download-music/omah-lay-reason-4"));
error_reporting(E_ERROR | E_PARSE);

$dom = new DOMDocument();
$dom->loadHTML(file_get_contents("one.html"));

$h1 = $dom->getElementsByTagName("h1")->item(0);
if ($h1 != null) {
	$text = $h1->nodeValue;
	$chars = explode("â", $text);
	if (count($chars) == 1) {
		$chars = explode("–", $text);
	}
	if (count($chars) > 1) {
		$artist = trim($chars[0]);
		$title = $chars[1];

		foreach ($dom->getElementsByTagName("a") as $a) {
			if ($a->getAttribute("class") == "btn-ghost") {
				$mp3_url = $a->getAttribute("href");
				if (strpos($mp3_url, ".mp3") !== false) {
					// code...
				}
			}
		}

		//get artwork
		foreach ($dom->getElementsByTagName("div") as $div) {
			$classes = explode(" ", $div->getAttribute("class"));
			if (in_array("post-page-featured-image", $classes)) {
				$img = $div->getElementsByTagName("img")->item(0);
				$artwork = $img->getAttribute("src");
			}
		}
	}

	echo json_encode(['artist' => $artist,'title' => $title,'mp3_url' => $mp3_url,'artwork' => $artwork,]);
	echo "<br>".$text;
}
?>