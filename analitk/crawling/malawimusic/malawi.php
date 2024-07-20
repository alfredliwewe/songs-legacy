<?php 
//error_reporting(0);
require '../../includes/String.php';
error_reporting(E_ERROR | E_PARSE);

class MalawiMusic{
	public $html = "";
	public $errors = [];

	function __construct($html)
	{
		$this->html = $html;

		$this->doc = new DOMDocument();
		$this->doc->loadHTML($html);
		$this->doc->normalizeDocument();
	}

	public function getArtist()
	{
		$title = $this->doc->getElementsByTagName('title')->item(0)->nodeValue;
		$title = str_replace('- Malawi-Music.com', "", $title);
		$title = trim(trim($title));

		$data['name'] = $title;

		//getting image
		$image = "pro_file.png";
		foreach($this->doc->getElementsByTagName("meta") as $meta){
			if ($meta->getAttribute("property") == "og:image") {
				$image = $meta->getAttribute("content");
			}

			if ($meta->getAttribute("property") == "og:url") {
				$data['link'] = $meta->getAttribute('content');
			}
		}
		if (isset($data['link'])) {
			$chars = explode("/", $data['link']);
			$data['webid'] = explode("-", $chars[count($chars)-1])[0];
		}

		$data['image'] = $image;


		//get albums 
		$albums = [];
		foreach($this->doc->getElementsByTagName("div") as $f){
			if ($f->getAttribute("class") == "album") {
				$album_data = [];

				$album_pic = $f->getElementsByTagName("div")->item(0);
				$album_data['link'] = $album_pic->getElementsByTagName("a")->item(0)->getAttribute('href');
				$album_data['image'] = $album_pic->getElementsByTagName("img")->item(0)->getAttribute('src');

				foreach($f->getElementsByTagName("div") as $g){
					if ($g->getAttribute("class") == "albumdetail2") {
						$album_data['name'] = $g->getElementsByTagName("a")->item(0)->nodeValue;
					}
				}
				//get webid //https://www.malawi-music.com/B/2487-boy-p/12546-family
				$chars = explode("/", $album_data['link']);
				$album_data['webid'] = explode("-", $chars[count($chars)-1])[0];

				array_push($albums, $album_data);
			}
		}
		$data['albums'] = $albums;

		//get biography
		$div = null;
		foreach($this->doc->getElementsByTagName("div") as $d){
			if ($d->getAttribute('class') == "songdetails") {
				$div = $d;
			}
		}
		if ($div != null) {
			$tags = ['br', 'strong', 'div'];
			foreach($tags as $tag){
				foreach($div->getElementsByTagName($tag) as $elem){
					try{
						$this->doc->removeChild($elem);
					}catch(Exception $e){
						array_push($this->errors, $e->getMessage());
					}
				}
			}

			//$data['biography'] = $div->nodeValue;
		}

		//$data['errors'] = $this->errors;
		return $data;
	}

	public function getSong()
	{
		//getting image
		$image = "pro_file.png";
		foreach($this->doc->getElementsByTagName("meta") as $meta){
			if ($meta->getAttribute("property") == "og:image") {
				$image = $meta->getAttribute("content");
			}

			if ($meta->getAttribute("property") == "og:url") {
				$data['link'] = $meta->getAttribute('content');
			}
		}
		if (isset($data['link'])) {
			$chars = explode("/", $data['link']);
			$data['webid'] = explode("-", $chars[count($chars)-1])[0];
		}

		$data['artwork'] = $image;

		//get song name
		foreach($this->doc->getElementsByTagName("div") as $div){
			if ($div->getAttribute('class') == "container-fluid") {
				$h1 = $div->getElementsByTagName("h1")->item(0);

				if ($h1 != null) {
					$a = $h1->getElementsByTagName("a")->item(0);
					$h1->removeChild($a);

					$data['title'] = $h1->nodeValue;
					$data['title'] = substr($data['title'], 3);
				}
				else{

				}
			}
		}


		//getting other data
		$meta = [];
		foreach($this->doc->getElementsByTagName("div") as $div){
			if ($div->getAttribute("class") == "songdetails") {
				$children = $div->getElementsByTagName("div");

				foreach($children as $child){
					$strong = $child->getElementsByTagName("strong")->item(0);
					if ($strong != null) {
						$row['key'] = $strong->nodeValue;
						$row['key'] = str_replace(" : ", "", $row['key']);
						$row['key'] = trim($row['key']);
						$child->removeChild($strong);
						$row['value'] = trim($child->nodeValue);
						//array_push($meta, $row);
						$row['key'] = $row['key'] == "Artist name" ? "artist" : $row['key'];
						$row['key'] = $row['key'] == "Length" ? "duration" : $row['key'];
						$row['key'] = str_replace(" ", "_", $row['key']);
						
						$meta[strtolower(trim($row['key']))] = $row['value'];
					}
				}
			}
		}

		$cut = Strings::cutBetweenStrings($this->html, "mp3:", "poster:");
		
		if($cut != false){
			$audio = trim(str_replace(",", "", str_replace("\"", "", trim($cut))));
    		$data['mp3_url'] = trim($audio);
    
    		$data = [...$data, ...$meta];

    		//make year
    		$chars = explode(" - ", $data['added_on'])[0];
    		$data['year'] = trim(explode(".", $chars)[2]);
    		$data['date_added'] = strtotime(str_replace(".", "-", str_replace(" - ", "", $data['added_on'])));
    
    		return $data;
		}
		else{
			//try finding the script
		    return $data;
		}
	}
}

//$malawi = new MalawiMusic(file_get_contents("song.html"));

//var_dump($malawi->getArtist());
//var_dump($malawi->getSong());