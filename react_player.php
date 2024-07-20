<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>React Sample Player</title>
	<?php require 'links.php';?>
    <style type="text/css">
        .slbt{
            margin-left: 5px;
        }
    </style>
    <script	src="http://localhost/resources/react.js" crossorigin="anonymous"></script>
	<script src="http://localhost/resources/react-dom.js"></script>
	<script src="http://localhost/resources/material-ui.js" crossorigin="anonymous" ></script>
	<script src="http://localhost/resources/babel.js" crossorigin="anonymous" ></script>
</head>
<body>
<div id="react_player"></div>
</body>
<?php 
$files = ['components/Player.js'];
foreach($files as $file){
	echo "<script type=\"text/babel\">".file_get_contents($file)."</script>";
}
?>
<script type="text/javascript">
	$(document).ready(function(event) {
		printPlayer();
	})
</script>
</html>