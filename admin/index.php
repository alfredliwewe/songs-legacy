<?php 
session_start();
?><!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Admin Page</title>
	<?php require 'links.php';?>
	<style type="text/css">
		.menu-button.active{
			position: relative;
		}
		.menu-button.active::after{
			content: '';
			height: 100%;
			width: 3px;
			border-top-left-radius: 6px;
			border-bottom-left-radius: 6px;
			background-color: var(--dark);
			position: absolute;
			top: 0;
			right: 0;
		}
	</style>
</head>
<body>
<div id="root"></div>
</body>
<?php 
if (isset($_SESSION['user_id'])) {
	if (strpos(strtolower($_SERVER['HTTP_USER_AGENT']), "android") OR strpos(strtolower($_SERVER['HTTP_USER_AGENT']), "iphone")) {
		$files = [
			'jsx/mobile.jsx'
		];
	}
	else{
		$files = [
			'jsx/admin.jsx'
		];
	}
}
else{
	$files = [
		'jsx/login.jsx'
	];
}

foreach($files as $file){
	echo "<script type='text/babel'>".file_get_contents($file)."</script>";
}
?>
</html>