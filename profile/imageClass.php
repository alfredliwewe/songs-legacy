<?php
/**
* This file contains all necessary methods of image manipulation
*/
class rodzImage
{
	function cropImage($filename, $ext)
	{
		//switching img create function
		switch ($ext) {
			case 'jpg':
				$im = imagecreatefromjpeg($filename);
				break;
			
			case 'jpeg':
				$im = imagecreatefromjpeg($filename);
				break;

			case 'png':
				$im = imagecreatefrompng($filename);
				break;

			case 'gif':
				$im = imagecreatefromgif($filename);
				break;

			case 'webp':
				$im = imagecreatefromwebp($filename);
				break;			
			default:
				# code...
				break;
		}
		$size_x = imagesx($im);
		$size_y = imagesy($im);
		$size = min($size_x, $size_y);
		//make cropping to take the center of the image

		$new_width = (270/400) * $size_y;
		$dif = $size_x - $new_width;
		$ini_x = ceil(($dif/2));
		
		$ini_y = 0;
		$im2 = imagecrop($im, ['x' => $ini_x, 'y' => $ini_y, 'width' => $new_width, 'height' => $size_y]);
		if ($im2 !== FALSE) {
		    //$myImage = imagepng($im2, $filename);

		    //trying resampling the image
		    $percent = 0.4;
		    $src_width = $new_width;

			// Get new dimensions
			$new_width = $new_width * $percent;
			$new_height = $size_y * $percent;

			// Resample
			$image_p = imagecreatetruecolor($new_width, $new_height);
			$image = $im2;
			imagecopyresampled($image_p, $image, 0, 0, 0, 0, $new_width, $new_height, $src_width, $size_y);

			
			$final_name = '../artwork/'.rand(10000,99999)."_".rand(10000,99999).".jpg";
			imagejpeg($image_p, $final_name, 100);
			
		    imagedestroy($im2);

		    return $final_name;
		}
		imagedestroy($im);
		//else deny the process

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
}



?>