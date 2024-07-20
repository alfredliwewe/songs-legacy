<?php
require '../../db.php';
if (isset($_GET['q'])) {
	$q = $_GET['q'];
}
else{
	$q = "";
}
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Search complete</title>
	<link rel="stylesheet" type="text/css" href="http://localhost/songs/w3css/w3.css">
	<style type="text/css">
		body{
			font-family: Arial, Helvetica, sans-serif;
		}
	</style>
</head>
<body>
<form>
	<p>
		<input type="text" value="<?=$q;?>" placeholder="Search" name="q">
	</p>
	<p>
		<input type="submit" name="submit">
	</p>
</form>
<?php
if (isset($_GET['q'])) {
	$text = $db->real_escape_string($_GET['q']);

	$text = "%".str_replace(" ", "%", $text)."%";

	$res = $db->query("SELECT * FROM search WHERE `text` LIKE '$text' LIMIT 20");
	$already = [];
	while ($row = $res->fetch_assoc()) {
		$can = true;
		if (isset($already[$row['ref']])) {
			if ($already[$row['ref']] == $row['type']) {
				$can = false;
			}
		}
		if ($can) {
			echo "<div class='w3-padding w3-border-bottom w3-hover-light-grey pointer'>{$row['text']}</div>";
			$already[$row['ref']] = $row['type'];
		}
	}
}
?>
</body>
</html>