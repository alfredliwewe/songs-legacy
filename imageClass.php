<?php
/**
* This file contains all necessary methods of image manipulation
*/
class rodzImage
{
	public function __construct($file)
	{
		$this->file = $file;
		$chars = explode(".", $file);
		$this->ext = strtolower($chars[count($chars)-1]);
		$this->mime = mime_content_type($file);
	}

	function cropImage($output)
	{
		//switching img create function
		switch ($this->mime) {
			case 'image/jpeg':
				$im = imagecreatefromjpeg($this->file);
				break;
			
			case 'image/png':
				$im = imagecreatefrompng($this->file);
				break;

			case 'image/webp':
				$im = imagecreatefromwebp($this->file);
				break;

			case 'image/webp':
				$im = imagecreatefromgif($this->file);
				break;			
			default:
				# code...
				break;
		}
		
		if(isset($im)){
    		$size_x = imagesx($im);
    		$size_y = imagesy($im);
    		$size = min($size_x, $size_y);
    		//make cropping to take the center of the image
    
    		if ($size_x > $size) {
    			$dif = $size_x - $size;
    			$ini_x = ceil(($dif/2));
    		}
    		else{
    			$ini_x = 0;
    		}
    
    		if ($size_y > $size) {
    			$dif = $size_y - $size;
    			$ini_y = ceil(($dif/2));
    		}
    		else{
    			$ini_y = 0;
    		}
    		$im2 = imagecrop($im, ['x' => $ini_x, 'y' => $ini_y, 'width' => $size, 'height' => $size]);
    		if ($im2 !== FALSE) {
    		    //$myImage = imagepng($im2, $filename);
    
    		    //trying resampling the image
    		    $percent = 0.1;
    
    			// Get new dimensions
    			$new_width = 200;
    			$new_height = 200;
    
    			// Resample
    			$image_p = imagecreatetruecolor($new_width, $new_height);
    			$image = $im2;
    			imagecopyresampled($image_p, $image, 0, 0, 0, 0, $new_width, $new_height, $size, $size);
    			
    			imagepng($image_p, $output, 8);
    			imagedestroy($im);
    		    imagedestroy($im2);
    		    return true;
    		}
    		else{
    		    imagedestroy($im);
    		    return false;
    		}
    		
    		//else deny the process
		}
		else{
		    return false;
		}
	}

	function resample($filename, $id, $timeStamp, $mysqli)
	{
		# reduces quality...
		$percent = 0.3;

		header('Content-Type: image/jpeg');

		if (file_exists($filename)) {
			// Get new dimensions
			list($width, $height) = getimagesize($filename);
			$new_width = $width * $percent;
			$new_height = $height * $percent;

			// Resample
			$image_p = imagecreatetruecolor($new_width, $new_height);
			$image = imagecreatefromjpeg($filename);
			imagecopyresampled($image_p, $image, 0, 0, 0, 0, $new_width, $new_height, $width, $height);

			// Output
			$uni = time();
			$var = rand(1000000, 19961013);
			$first = substr($filename, 0, 6);
			$second = substr($filename, 6);
			$final_name = $first.$uni."_".$var."_".$second;
			imagejpeg($image_p, $final_name, 100);
			return $final_name;
		}
		else{
			return;
		}
	}


	function resampleProfile($filename, $id, $timeStamp, $mysqli)
	{
		# reduces quality...
		$percent = 0.3;

		header('Content-Type: image/jpeg');

		if (file_exists($filename)) {
			// Get new dimensions
			list($width, $height) = getimagesize($filename);
			$new_width = $width * $percent;
			$new_height = $height * $percent;

			// Resample
			$image_p = imagecreatetruecolor($new_width, $new_height);
			$image = imagecreatefromjpeg($filename);
			imagecopyresampled($image_p, $image, 0, 0, 0, 0, $new_width, $new_height, $width, $height);

			// Output
			$uni = time();
			$var = rand(1000000, 19961013);
			$first = substr($filename, 0, 6);
			$second = substr($filename, 6);
			$final_name = $first.$uni."_".$var."_".$second;
			$sql = $mysqli->query("UPDATE photo SET resampled = '$final_name' WHERE time_me = '$timeStamp' ");
			imagejpeg($image_p, $final_name, 100);
		}
		else{
			return;
		}
	}

	function rgb($img, $x, $y)
	{
		$rgb = imagecolorat($img, $x, $y);
		$r = ($rgb >> 16) & 0xFF;
		$g = ($rgb >> 8) & 0xFF;
		$b = $rgb & 0xFF;
		return [$r, $g, $b];
	}

	public function getAvgColor()
	{
		switch ($this->mime) {
			case 'image/jpeg':
				$img = imagecreatefromjpeg($this->file);
				break;
			
			case 'image/png':
				$img = imagecreatefrompng($this->file);
				break;

			case 'image/webp':
				$img = imagecreatefromwebp($this->file);
				break;

			case 'image/webp':
				$img = imagecreatefromgif($this->file);
				break;			
			default:
				# code...
				break;
		}

		if (isset($img)) {
	
			$x = imagesx($img);
			$y = imagesy($img);

			$r = [];
			$g = [];
			$b = [];


			for ($i=0; $i < $x; $i++) { 
				for ($j=0; $j < $y; $j++) { 
					$point = $this->rgb($img, $i, $j);

					array_push($r, $point[0]);
					array_push($g, $point[1]);
					array_push($b, $point[2]);
				}
			}

			return [(int)(array_sum($r)/count($r)), (int)(array_sum($g)/count($g)), (int)(array_sum($b)/count($b))];
		}
		else{
			return [77, 0, 77];
		}
	}
}


function getMeImage($filename){
	$chars = explode(".", $filename);
	$ext = strtolower($chars[count($chars)-1]);
	$mime = mime_content_type($filename);


	$im = null;

		//switching img create function
		switch ($mime) {
			case 'image/jpeg':
				$im = imagecreatefromjpeg($filename);
				break;

			case 'image/png':
				$im = imagecreatefrompng($filename);
				break;

			case 'image/webp':
				$im = imagecreatefromwebp($filename);
				break;

			case 'image/gif':
				$im = imagecreatefromgif($filename);
				break;			
			default:
				# code...
				break;
		}
	return $im;
}
?>