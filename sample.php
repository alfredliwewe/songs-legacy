<?php 
require 'db.php';
//require '../config.php';
// require '../device.php';

// $client = new client_info;
// $client_os = $client->os;
// $client_browser = $client->browser_name;
// $device_type = $client->device;

// $_SESSION['device'] = $device_type;

//generate random user id;
if (isset($_COOKIE['user_id'])) {
    $user_id_cookie = $_COOKIE['user_id'];
    setcookie('user_id', $user_id_cookie, time()+(3600*24*30));
}
else{
    $user_id_cookie = rand(100001,999999);
    setcookie('user_id', $user_id_cookie, time()+(3600*24*30));
}

if (isset($_COOKIE['logged_user_id'])) {
    $user_id = $_COOKIE['logged_user_id'];

    $data = $db->query("SELECT * FROM users WHERE id = '$user_id' ")->fetch_assoc();
    if ($data) {
        $_SESSION['user'] = $data;
        $_SESSION['has_logged_in'] = $data['id'];
        $_SESSION['user_id'] = $data['id'];

        setcookie('logged_user_id', $data['id'], time()+(3600 * 24 * 30));
    }
}
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title><?=$config['name'];?></title>
	<?php require 'links.php';?>
	<meta property="og:title" content="<?=$config['name'];?>">
	<meta property="og:type" content="article" />
	<meta property="og:description" content="Welcome to <?=$config['name'];?>. Browse through 4+ million songs">
	<meta property="og:image" content="<?=$config['host'];?>/images/logo.png">
	<meta property="og:url" content="=<?=$config['host'];?>">
	<meta name="twitter:card" content="summary_large_image">
	<link rel="icon" type="image/*" href="./images/logo.png">
</head>
<body class="w3-white">
<div class="w3-row">
    <div class="w3-col m4">&nbsp;</div>
    <div class="w3-col m4">
        <div id="amuze-root"></div>
    </div>
</div>

<div class="loading-start w3-center w3-white" id="loading-start">
	<img src="./images/wp.png">
</div>
<audio id="audio" style="display:none;" controls></audio>
</body>
<script type="text/javascript">
	<?php 
    if (isset($_COOKIE['user_id'])) {
        ?>
        var user_id = <?=$_COOKIE['user_id'];?>;
        <?php
    }
    else{
        ?>
        var user_id = 0;
        <?php
    }
    ?>
</script>
<?php 
$files = [
    'mobile/sample.jsx',
    'mobile/MainContent.jsx',
];
foreach($files as $file){
    echo "<script type=\"text/babel\">".file_get_contents($file)."</script>";
}
?>
</html>