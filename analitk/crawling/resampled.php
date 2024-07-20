<?php
require '../db.php';
require '../imageClass.php';

$res = $db->query("SELECT * FROM web_songs WHERE resampled_artwork = '' AND artwork NOT LIKE '%trendybeatz.com%' LIMIT 0,10");
if ($res->num_rows > 0) {
    $read = $db->query("SELECT * FROM web_songs WHERE resampled_artwork = '' LIMIT 0,10");
    //echo $db->error;
    $queries = [];
	while ($data = $read->fetch_assoc()) {
		$chars = explode("/", $data['artwork']);
		$filename = $chars[count($chars)-1];

		$filename = rand(10001,90009)."_".rand(10001,90009).".png";
		file_put_contents("../artwork/".$filename, file_get_contents($data['artwork']));

        if(filesize("../artwork/".$filename) > (1024*10)){
    		$img = new rodzImage("../artwork/".$filename);
    		$res = $img->cropImage("../artwork/".$filename);
    		if($res){
    		    //$db->query("UPDATE web_songs SET resampled_artwork = '$filename' WHERE id = '{$data['id']}' ");
    		    array_push($queries, "UPDATE web_songs SET resampled_artwork = '$filename' WHERE id = '{$data['id']}'; ");
    		}
    		else{
    			unlink("../artwork/".$filename);
    		    //$db->query("UPDATE web_songs SET resampled_artwork = 'icon.png' WHERE id = '{$data['id']}' ");
    		    array_push($queries, "UPDATE web_songs SET resampled_artwork = 'icon.png' WHERE id = '{$data['id']}';");
    		}
        }
        else{
        	unlink("../artwork/".$filename);
            //$db->query("UPDATE web_songs SET resampled_artwork = 'icon.png' WHERE id = '{$data['id']}' ");
            array_push($queries, "UPDATE web_songs SET resampled_artwork = 'icon.png' WHERE id = '{$data['id']}'; ");
        }
	}
	
	$db->multi_query(implode("\n", $queries));

	/*$done = (int)$db->query("SELECT COUNT(id) AS count_all FROM web_songs WHERE resampled_artwork != '' ")->fetch_assoc()['count_all'];
	$remaining = (int)$db->query("SELECT COUNT(id) AS count_all FROM web_songs WHERE artwork != '' AND resampled_artwork = '' ")->fetch_assoc()['count_all'];

	echo "<h1>$done done, remaining $remaining</h1>";*/
	echo rand(1001,9009);
	?>
	<script type="text/javascript">
		window.onload = function() {
			setTimeout(()=>{
				window.location = 'resampled.php';
			}, 100);
		}
	</script>
	<?php
}
else{
	echo "Probably finished";
}
?>