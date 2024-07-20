<?php
require 'imageClass.php';

if (isset($_GET['artwork'])) {
	$filename = $_GET['artwork'];

	if (file_exists("artwork/".$filename) && strlen($filename) > 4) {
		list($width, $height) = getimagesize("artwork/".$filename);
		$min = min($width, $height);
		if ($min > 200) {
			$ratio = $min > 1800 ? 9 : ceil($min/200);
			$image = getMeImage("artwork/".$filename);
			header('Content-Type: image/png');
			$image_p = imagecreatetruecolor(200, 200);
			imagecopyresampled($image_p, $image, 0, 0, 0, 0, 200, 200, $width, $height);

			header('Content-Type: image/png');
			imagepng($image_p,null,$ratio);

			//imagepng($image_p,"saves/".$filename,$ratio);

			imagedestroy($image);
			imagedestroy($image_p);
			//echo json_encode(['done' => $ratio]);
		}
		else{
			header("location: artwork/".$filename);
		}
	}
	else{
		header("location: artwork/icon.png");
	}
}
else{
	header("location: artwork/icon.png");
}
?>