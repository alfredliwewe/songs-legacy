<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Replica of Firebase</title>
	<?php require 'links.php';?>
</head>
<body>
<div id="root"></div>
</body>
<script type="text/babel">
	
window.onload = function(){
    ReactDOM.render(<BottomPlayer />, document.getElementById("root"));
}
</script>
<?php 

$files = [
	'components/PlayerBottom.jsx'
];

foreach($files as $file){
	echo "<script type='text/babel'>".file_get_contents($file)."</script>";
}

?>
</html>