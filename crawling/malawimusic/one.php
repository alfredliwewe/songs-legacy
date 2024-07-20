<?php
require("malawi.php");
//file_put_contents("one.html", file_get_contents("https://www.malawi-music.com/T/213-the-dare-devilz/260-the-daredevilz-music/965-mukuti-cha"));

//echo "done";
$mw = new MalawiMusic(file_get_contents("one.html"));
$song = $mw->getSong();

header('Content-Type: application/json; charset=utf-8');
echo json_encode($song);


//$cut = Strings::cutBetweenStrings($mw->html, "mp3:", "poster:");
//$mp3_url = trim(str_replace(",", "", str_replace("\"", "", trim($cut))));
?>