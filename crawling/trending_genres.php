<?php
require '../db.php';

$data = json_decode(file_get_contents("genres.json"),true);

$time = time();
$message = "done";

if ($time - $data['lastTime'] > 3600 * 3) {
	$read = $db->query("SELECT * FROM genre WHERE id > {$data['current']} LIMIT 1");
	if ($read->num_rows > 0) {
		$genre_data = $read->fetch_assoc();
		$data['current'] = $genre_data['id'];

		$sql = $db->query("SELECT id FROM web_songs WHERE genre = '{$genre_data['id']}' ORDER BY plays DESC LIMIT 4000 ");
		$ids = [];
		while ($row = $sql->fetch_assoc()) {
			array_push($ids, $row['id']);
		}

		$ids_str = implode(",", $ids);
		$db->query("UPDATE genre SET trending = '$ids_str' WHERE id = '{$genre_data['id']}' ");
		$message = "Updated -> ".$genre_data['name'];
	}
	else{
		//update the time
		$data['lastTime'] = $time;
		$message = "Updating lastTime";
	}
}

file_put_contents('genres.json', json_encode($data));
echo $message;
?>
<script type="text/javascript">
	window.onload = function(event) {
		window.location = 'trending_genres.php';
	}
</script>