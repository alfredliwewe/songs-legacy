<?php

require '../db.php';
require '../imageClass.php';

$read = $db->query("SELECT * FROM `web_songs` WHERE resampled_artwork != '' AND color = '' LIMIT 1");
if ($read->num_rows > 0) {
	$data = $read->fetch_assoc();

	$artwork = $data['resampled_artwork'];
	if (file_exists("../artwork/$artwork")) {
		$img = new rodzImage("../artwork/$artwork");
		$colors = implode(",", $img->getAvgColor());

		$db->query("UPDATE web_songs SET color = '$colors' WHERE id = '{$data['id']}' ");
		echo "Done with - {$data['title']} - rgb($colors)";
	}
	else{
		$db->query("UPDATE web_songs SET resampled_artwork = '' WHERE id = '{$data['id']}' ");
		echo "File not found - $artwork";
	}
	?>
	<script type="text/javascript">
		window.onload = ()=>{
			window.location = 'fix_colors.php?id=<?=$data['id'];?>'
		}
	</script>
	<?php
}
else{
	echo "Probably finished";
}