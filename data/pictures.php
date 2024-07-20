<?php

require '../db.php';
require '../imageClass.php';

$read = $db->query("SELECT * FROM web_songs WHERE plays > 0 AND resampled_artwork = '' AND artwork LIKE '%http%' LIMIT 1");
if ($read->num_rows == 1) {
	$data = $read->fetch_assoc();
	$filename = rand(10001,98001)."_".rand(10001,98001).".png";

	file_put_contents("../artwork/$filename", file_get_contents($data['artwork']));
	$db->query("UPDATE web_songs SET resampled_artwork = '$filename' WHERE id = '{$data['id']}' ");

	$img = new rodzImage("../artwork/$filename");
	$img->cropImage("../artwork/$filename");

	echo "done - <h3>".$data['title']."</h3>";
	?>
	<script type="text/javascript">
		window.onload = function(event) {
			window.location = 'pictures.php';
		}
	</script>
	<?php
}
else{
	echo "Probably finished";
}