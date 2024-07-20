<?php 
require '../db.php';
require '../config.php';

if(isset($_GET['v'])){
    $id = (int)trim($_GET['v']);

    $data = $db->query("SELECT * FROM web_songs WHERE id = '$id' ")->fetch_assoc();
    $artist = $db->query("SELECT * FROM web_artists WHERE id = '{$data['artist']}' ")->fetch_assoc();
    $data['artist_data'] = $artist;
    if($data['website'] == "mdundo"){
        $data['mp3_url'] = "https://mdundo.com/stream/".$data['webid'];
    }

    $tags = [];
    $read = $db->query("SELECT * FROM tag_song JOIN tags ON tag_song.tag = tags.id WHERE song = '$id' ");
    while($row = $read->fetch_assoc()){
        array_push($tags, $row);
    }
    $data['tags'] = $tags;
}
else{
    header("location: index.php");
}
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title><?=$data['title']." {$artist['name']} ".$config['name'];?></title>
	<?php require 'links.php';?>
	<meta property="og:title" content="<?php echo $data['title']." - ".$artist['name'];?> | <?=$config['name'];?>">
	<meta property="og:type" content="article" />
	<meta property="og:description" content="Play and download <?=$data['title']." {$artist['name']} ".$config['name'];?> from <?=$config['name'];?>. Browse through 4+ million songs">
	<meta property="og:image" content="<?=$config['host'];?>/artwork/<?=$data['resampled_artwork'];?>">
	<meta property="og:url" content="=<?=$config['host'];?>/play.php?v=$id">
	<meta name="twitter:card" content="summary_large_image">
	<link rel="icon" type="image/*" href="../images/logo.png">
</head>
<body class="w3-white">
<div id="amuze-root"></div>
<audio id="audio" style="display:none;"></audio>
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
    var str = '<?=json_encode($data);?>';
    var str2 = '<?=json_encode($artist);?>';
</script>
<?php 
$files = [
    '../components/Web.js',
    '../components/TopBar.js',
    '../components/MainContent.js',
    '../components/SongsDisplay.js',
    '../components/Player.jsx',
    '../components/MuiSlider.js',
    '../components/MobileView.js',
    '../components/CommentView.js',
    '../components/ComposeComment.js',
    '../components/LoginForm.js',
    'handler.jsx'
];
foreach($files as $file){
    echo "<script type=\"text/babel\">".file_get_contents($file)."</script>";
}
?>
</html>