<?php
session_start();
$dbx = new sqlite3("../dt/src/main.db");
require '../functions.php';
visit("free");
require '../device.php';
$client = new client_info;
$client_os = $client->os;
$client_browser = $client->browser_name;
$device_type = $client->device;
$_SESSION['device'] = $device_type;

?>
<!DOCTYPE html>
<html>
<head>
    <title>RODZ Music - Stream and Purchase Music</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#0d0d0d" />
    <link rel="manifest" href="../manifest.json">
    <link rel="stylesheet" type="text/css" href="../w3css/w3.css">
    <link rel="stylesheet" type="text/css" href="../vendor/bootstrap/css/bootstrap.min.css">
    <script type="text/javascript" src="../vendor/jquery/jquery.min.js"></script>
    <script type="text/javascript" src="../vendor/bootstrap/js/bootstrap.min.js"></script>
    <link rel="stylesheet" type="text/css" href="../semantic/semantic.min.css">
    <link rel="stylesheet" type="text/css" href="../fontawesome/css/all.css">
    <style type="text/css">
        .pointer:hover{
            cursor: pointer;
        }
        .top-bar{
            border-top: 3px solid #3385ff !important;
        }
        .hide_images img{
            display: none;
        }
        .extendable{
            height: 600px;overflow-y: hidden;
        }
        .extendable img{
            display: none;
        }
        input{
            padding: 7px 7px !important;
            border: 0px !important;
        }
        input[type="text"]{
            border:;
        }
    </style>
</head>
<body>
    <?php 
    if ($device_type == "mobile") {
        ?>
        <div class="bg w3-padding-large w3-row">
            <font class="w3-large"><i class="fa fa-music w3-text-orange"></i> RODZ MUSIC <i class="fa fa-bars w3-right w3-text-orange pointer" onclick="$('#nav_mobile_modal').show();"></i></font>
        </div>
        <div class="bg w3-padding w3-row">
            <div class="w3-col m6 s12 w3-padding">
                <button class="btn bg w3-text-white" onclick="window.location = '../'">Home</button> <button class="btn bg w3-text-white" onclick="window.location = '../weekly/' ">Weekly</button> <button class="btn bg w3-text-white" onclick="window.location = '../genres/' ">Genres</button> <button class="btn btn-danger w3-round-jumbo" onclick="window.location = '../free/' ">Free</button>
            </div>
        </div>
        <?php
    }
    else{
        ?>
        <div class="bg w3-padding w3-row">
            <div class="w3-col m1">&nbsp;</div>
            <div class="w3-col m6 w3-padding">
                <font class="w3-large"><i class="fa fa-music w3-text-orange"></i> RODZ MUSIC</font> <button class="btn bg w3-text-white" onclick="window.location = '../'">Home</button> <button class="btn bg w3-text-white" onclick="window.location = '../weekly/'">Weekly</button> <button class="btn bg w3-text-white" onclick="window.location = '../genres/'">Genres</button> <button class="btn btn-danger w3-round-jumbo" onclick="window.location = '../free/'">Free</button>
            </div>
            <div class="w3-col m5 clearfix w3-padding">
                 <button class="btn btn-outline-info pointer w3-marging-left btn-sm w3-round-xxxlarge" onclick="window.location = 'apply.php' ">Stay home</button> &nbsp;<button class="btn btn-outline-info pointer btn-sm w3-round-jumbo" onclick="$('#results_container').show();">Search <i class="fa fa-search"></i></button> &nbsp;<button class="btn btn-outline-info pointer btn-sm w3-round-jumbo" onclick="window.location = '../signin/' ">Sign in</button>
            </div>
        </div>
        <br>
        <?php
    }
    require '../mobile_nav.php';
    ?>
    <div class="w3-row">
        <div class="w3-col m1">&nbsp;</div>
        <div class="w3-col m10">
            <h2 class="w3-padding">Top Free Trending Music</h2>
            <div class="w3-row"><div class="w3-responsive">
                <?php
                $sql1 = $dbx->query("SELECT COUNT(file_id) AS count_all FROM songs INNER JOIN files ON songs.file_id = files.id WHERE songs.price = '0' ORDER BY songs.id DESC LIMIT 10");
                $d = $sql1->fetchArray();
                $width = ($d['count_all']+1) * 200;
                echo "<div style=\"width: ".$width."px;\">";
                $sql = $dbx->query("SELECT *, songs.id AS song_id FROM songs INNER JOIN files ON songs.file_id = files.id WHERE songs.price = '0' ORDER BY songs.id DESC LIMIT 10");
                while ($row = $sql->fetchArray()) {
                    $song_id = $row['song_id'];
                    if (strlen($row['resampled_artwork']) > 4) {
                        $artwork = $row['resampled_artwork'];
                    }
                    else{
                        $artwork = $row['artwork'];
                    }
                    ?>
                    <div class="w3-col w3-padding pointer" style="width: 200px; float: left;">
                        <div class="w3-display-container" onmouseenter="$(this).addClass('shadow')" onmouseleave="$(this).removeClass('shadow')" onclick="window.location = '../song/?id=<?php echo $row['song_id'];?>' ">
                            <div style="height: 200px;overflow-y: hidden;"><img src="../artwork/<?php echo $artwork;?>" width="100%" class="rounded"></div>
                            <div class="w3-display-topleft w3-container"><span class="w3-tag w3-blue">New!</span></div>
                            <div class="w3-display-bottomright w3-container w3-padding-large"><span class="badge badge-info"><?php echo get_download($song_id);?> <i class="fa fa-arrow-down"></i></span> <span class="badge badge-warning"><?php echo strip_tags(get_rating($song_id));?> <i class="fa fa-star"></i></span></div>
                        </div>
                        <div style="height: 90px;overflow-y: hidden;" class="w3-padding-small">
                            <h5 style="text-shadow: 1px 0px 5px #ffcccc;color: #000066"><?php echo $row['title'];?></h5>
                            <b><p class="text-info"><?php echo $row['artist'];?></p></b>
                        </div>
                    </div>
                    <?php
                }
                ?>
                <div class="w3-col w3-padding pointer" style="width: 200px; float: left;">
                    <div class="w3-display-container" onmouseenter="$(this).addClass('shadow')" onmouseleave="$(this).removeClass('shadow')">
                        <div style="height: 200px;overflow-y: hidden;"><img src="../images/default.jpg" width="100%" class="rounded"></div>
                        <div class="w3-display-middle w3-container" style="margin-top: 60px;"><span class="w3-tag w3-blue w3-large">Get more free songs!</span></div>
                   
                    </div>
                    <div style="height: 90px;overflow-y: hidden;" class="w3-padding-small">
                        <b><p class="text-info">More free songs >></p></b>
                    </div>
                </div>
            </div></div></div>
            <br>
        </div>
    </div>
    <?php
    require '../footer.php';
    ?>
    <div class="w3-modal" id="results_container" style="padding-top: 20px;">
        <div class="w3-modal-content w3-card-16 w3-round-large" style="width: 500px;padding-bottom: 30px;">
            <div class="w3-padding-large bg rounded-top">
                <i class="fa fa-search w3-hover-text-yellow pointer" onclick="$('#results_container').fadeOut();"></i> Search in RODZ Music <i class="fa fa-times w3-right w3-hover-text-red pointer" onclick="$('#results_container').fadeOut();"></i>
            </div>
            <div class="w3-padding-large w3-row" id="main_content">
                <h1>&nbsp;</h1>
            </div>
            <div class="w3-padding clearfix">
                <button class="btn btn-danger btn-sm float-right" onclick="$('#results_container').fadeOut();">Close</button>
            </div>
        </div>
    </div>
<div class="w3-modal" id="toast_modal" style="padding-top: 20px;">
    <div class="w3-modal-content w3-card-16 w3-padding-large alert-success w3-round-large w3-animate-top" id="toast_content" onclick="this.parentElement.style.display = 'none'"></div>
</div>
</body>
<script type="text/javascript">
    var  deli = 1;
    function change_slide() {
        var new_num = deli + 1;

        $('#slide_image').attr('src', "images/"+new_num+'.png');

        if (new_num == 6) {
            deli = 1;
        }
        else{
            deli = new_num;
        }

        setTimeout(change_slide, 5000);
    }

    $('#top_search').on('keyup', function(event) {
        var text = $(this).val();
        if (text.length > 0) {
            $('#results_container').show();
        }
    })

    $('.bn').click(function (event) {
        event.preventDefault();
        var target = $(this).attr('data');
        $('.bn').removeClass('w3-blue').addClass('btn-blue');
        $(this).removeClass('btn-blue').addClass('w3-blue');
        $('.ts').hide();
        $('#'+target).fadeIn(200);
    });

    //change_slide();

    function submit(event) {
        if (event.keyCode === 13) {
            var key_code = $('#key_code').val();
            $('#results_container').show();
            $('#main_content').load("rest_api.php?key_code="+key_code);
        }
    }

    function Toast(msg) {
        $('#toast_content').html(msg);
        $('#toast_modal').show();

        var close = function() {
            $('#toast_modal').fadeOut();
        }

        setTimeout(close, 3000);
    }

    function submit1() {
        var key_code = $('#key_code').val();
        $('#results_container').show();
        $('#main_content').load("rest_api.php?key_code="+key_code);
    }
</script>
</html>