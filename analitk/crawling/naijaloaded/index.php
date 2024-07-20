<?php
require '../../functions.php';
require '../../includes/String.php';
require '../../includes/EndPoint.php';

$db = new mysql_like("naijaloaded.db3");
error_reporting(E_ERROR | E_PARSE);


$data = $db->query("SELECT * FROM links WHERE status = 'saved' LIMIT 0,1 ")->fetch_assoc();

if($data != false){
    //
    $text = file_get_contents($data['link']);
    //file_put_contents('data.html', $text);
    
    $domain = "naijaloaded.com.ng";
    
    $dom = new DOMDocument();
    $dom->loadHTML($text);
    
    $links = [];
    
    //check if link has audio download
    if(Strings::contains($data['link'], "naijaloaded.com.ng/download-music/")){
        //get song data
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

            echo EndPoint::saveSong(['artist' => $artist,'title' => $title,'mp3_url' => $mp3_url,'artwork' => $artwork,'country' => "Nigeria"]);
        }
    }
    
    foreach($dom->getElementsByTagName("a") as $li){
        $url = $li->getAttribute("href");
        $textHtml = $db->real_escape_string(trim(trim($li->nodeValue)));
        
        //check same domain
        if(strpos($url, $domain) === false){
            //leave
        }
        else{
            if (!Strings::endsWith($url, ".mp3")) {
                array_push($links, [$url,$textHtml]);
            }
        }
    }
    //save links
    $sql = "";
    $values = [];
    $pos = 1;
    foreach($links as $row){
        $link = $row[0];
        $textHtml = $row[1];

        $count = $db->query("SELECT * FROM links WHERE link = '$link' ")->num_rows;
        if ($count == 0) {
            if ($pos == 90) {
                $sql .= "INSERT INTO links (id, link, `text`, status) VALUES ".implode(", ", $values)."; \n";
                $pos = 0;
                $values = [];
            }

            array_push($values, "(NULL, '$link', '$textHtml', 'saved')");
            $pos += 1;
        }
    }

    if (count($values) > 0) {
        $sql .= "INSERT INTO links (id, link, `text`, status) VALUES ".implode(", ", $values)."; \n";
    }

    //execute the query
    $db->query($sql);
    $db->query("UPDATE links SET status = 'done' WHERE id = '{$data['id']}' ");
    echo "done - ".$data['link'];
}
else{
    echo "Probably finished";
}
?>