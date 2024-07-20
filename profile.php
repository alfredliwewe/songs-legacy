<?php
require 'db.php';
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
    <style type="text/css">
        .tops:hover::after, .tops.active::after{
            content: " ";
            background: #1565c0 !important;
            width: 50% !important;
            height: 4px !important;
            border-top-left-radius: 3px;
            border-top-right-radius: 3px;
            position: absolute;
            bottom: 0px;
            right: 25%;
            color: red;
            font-weight: bold;
            -webkit-transform: translateY(0px);
            transform: translateY(0px);
            transition: all 900ms ease;
            -webkit-transition: all 900ms ease;
            -ms-transition: all 900ms ease;
            -o-transition: all 900ms ease;
            -moz-transition: all 900ms ease;
        }
        .navbar-nav{
            position: relative;
            display: inline-block;
            padding: 15px 0px;
        }
        .pointer{
            cursor: pointer;
        }
    </style>
</head>
<body>
<div id="root"></div>
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
    'components/profile.jsx',
];
foreach($files as $file){
    echo "<script type=\"text/babel\">".file_get_contents($file)."</script>";
}
?>
</html>