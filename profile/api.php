<?php
session_start();
require '../db.php';
require 'imageClass.php';

$imag = new rodzImage();

function fileExt($filename)
{
    # returns the extension only...
    $filename = strtolower($filename);

    //reverse the string
    $reversed = strrev($filename);

    $a = 0;
    $position = stripos($reversed, ".");
    if (isset($position)) {
        # file might be true but check if other points are available...
        $choped = substr($reversed, 0, $position);
        $ext = strrev($choped);
        return $ext;
    }
}


if (isset($_SESSION['user_id'], $_SESSION['name'], $_SESSION['email'])) {
    $user_id = $_SESSION['user_id'];
    $name = $_SESSION['name'];
    $email = $_SESSION['email'];
    $phone = $_SESSION['phone'];

	if (isset($_POST['title'], $_POST['artist'], $_POST['genre'], $_POST['price'])) {
		$title = $db->real_escape_string($_POST['title']);
		$artist = $db->real_escape_string($_POST['artist']);
		$genre = $db->real_escape_string($_POST['genre']);
		$price = $db->real_escape_string($_POST['price']);

		if (isset($_FILES['artwork'])) {
			$filename = $_FILES['artwork']['name'];
			$tmp_name = $_FILES['artwork']['tmp_name'];

			$ext = fileExt($filename);

			if ($ext == "jpg" || $ext == "png" || $ext == "jpeg" || $ext == "gif" || $ext == "webp") {

				//move the uploaded file
				$new_filename = uniqid()."_".uniqid().".".$ext;
				move_uploaded_file($tmp_name, "../artwork/".$new_filename);
				$time = time();

				//cro and resample the image
				$resampled_artwork = $imag->cropImage("../artwork/".$new_filename, $ext);
				//get the latest file id from the the songs table
				$get = $dbx->query("SELECT * FROM files WHERE user_id = '$user_id' ORDER BY id DESC LIMIT 1");
				$file_data = $get->fetch_assoc();
				$file_id = $file_data['id'];

				$ins = $dbx->query("INSERT INTO songs (id, file_id, title, artist, genre, price, artwork, date_added, user_id, resampled_artwork, plays, downloads, album) VALUES (NULL, '$file_id', '$title', '$artist', '$genre', '$price', '$new_filename', '$time', '$user_id', '$resampled_artwork', '0', '0', '0')");
				
				if ($ins) {
					//$dbx->exec("UPDATE upload_pays SET status = 'used' WHERE phone = '$phone' ");
					//header("location: index.php?success");
					echo "success";
				}
				else{
					echo $dbx->lastErrorMsg();
				}
			}
			else{
				?>
				<strong>Warning!</strong> Unsupported file format!! Please choose an image
				<?php
			}
		}
	}
}
else{
	?>
	<strong>Warning!</strong> User details not detected!!
	<?php
}