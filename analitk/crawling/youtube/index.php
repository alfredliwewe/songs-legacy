<?php
require '../../functions.php';
require '../../includes/String.php';

$db = new mysql_like("youtube.db3");
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Youtube Links</title>
	<?php
	require 'links.php';
	?>
</head>
<body>
	<div id="root"></div>
</body>
<?php
$files = [
	"youtube.jsx"
];

foreach($files as $file){
	echo "<script type='text/babel'>".file_get_contents($file)."</script>:";
}
?>
</html>