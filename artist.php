<?php
session_start();
require 'db.php';
require 'device.php';
require 'functions.php';
require 'language.php';
require 'config.php';

visit("home");
$client = new client_info;
$client_os = $client->os;
$client_browser = $client->browser_name;
$device_type = $client->device;

$_SESSION['device'] = $device_type;

if (isset($_GET['language'])) {
    $language = $_GET['language'];
    $array_languages = array('english', 'chichewa');
    if (in_array($language, $array_languages)) {
        $_SESSION['language'] = $language;
    }
}
elseif(isset($_SESSION['language'])) {
    $language = $_SESSION['language'];
}
else{
    $language = "english";
}

if (isset($_GET['id'])) {
    $artist_id = (int)trim($_GET['id']);

    $data = $db->query("SELECT * FROM web_artists WHERE id = '$artist_id' ")->fetch_assoc();
}
else{
    header("location: index.php");
}
?>
<!DOCTYPE html>
<html>
<head>
    <title><?=$data['name'];?> | <?=$config['name'];?></title>
    <?php require 'links.php';?>
</head>
<body>
    <?php require 'left-bar.php';?>
    <div style="margin-left:120px">
        <br>
    <?php
    require 'home_nav.php';
    ?>
    <div class="w3-container">
        <div class="">
            <div class="w3-padding">
                <font class="h3 roboto block"><?=$data['name'];?></font>
                <div class="rounded bg-primary" style="width:40px;height:5px">&nbsp;</div>
            </div>
            <div class="pl-15 pr-15">
                <div class="w3-row pt-20">
                    <div class="w3-col m5">
                        <div class="clearfix">
                            <font class="bold w3-large roboto">Latest release</font>
                        </div>
                        <?php 
                        $all_songs = $db->query("SELECT * FROM web_songs WHERE artist = '$artist_id' ")->num_rows;
                        //get latest song
                        $read = $db->query("SELECT * FROM web_songs WHERE artist = '$artist_id' ORDER BY id DESC LIMIT 0,1 ");
                        if ($read->num_rows > 0) {
                            $song_data = $read->fetch_assoc();
                            ?>
                            <div class="w3-row pt-20">
                                <div class="w3-col m5 w3-center">
                                    <img src="artwork/<?=$song_data['resampled_artwork'];?>" class="rounded" width="80%">
                                </div>
                                <div class="w3-col m7">
                                    <h2>&nbsp;</h2>
                                    <p><?=date('M d, Y', strtotime($song_data['dateAdded']));?><br>
                                    <font class="bold"><?=$song_data['title'];?></font><br>
                                    <?=$song_data['artist'];?></p>
                                </div>
                            </div>
                            <?php
                        }
                        else{
                            //do nothing
                        }
                        ?>
                    </div>
                    <div class="w3-col m7">
                        <div class="clearfix">
                            <font class="bold w3-large roboto">Top songs</font>
                            <font class="bold float-right roboto text-primary">See all (<?=$all_songs;?>)</font>
                        </div>
                        <div class="w3-row pt-10">
                            <div class="w3-col m6 pr-10" id="top1"></div>
                            <div class="w3-col m6 pl-10" id="top2"></div>
                        </div>

                        <div class="w3-padding">
                            <button class="button mui-button button-contained mui-danger">Play all <i class="fa fa-play ml-15"></i></button>

                            <button class="button mui-button button-contained mui-secondary">Shuffle <i class="fa fa-play ml-15"></i></button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="pt-40 pl-15">
                <div class="clearfix">
                    <font class="bold w3-large roboto">Albums</font>
                </div>
            </div>
            <div id="songs" class="pt-10"></div>
            <br><br>
        </div>
    </div>
    <br>
    <div class="w3-padding mt-40">
        <font class="h3 roboto block">Similar Artists</font>
        <div class="rounded bg-primary" style="width:50px;height:5px">&nbsp;</div>
    </div>
    <div id="all_artists" class="pt-20"></div>

    <p>&nbsp;</p>
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    <?php require 'footer.php';?>
    <div class="w3-modal" id="results_container" style="padding-top: 20px;">
        <div class="w3-modal-content w3-card-16 w3-round-large" style="width: 500px;padding-bottom: 30px;">
            <div class="w3-padding-large bg rounded-top">
                <i class="fa fa-search w3-hover-text-yellow pointer" onclick="$('#results_container').fadeOut();"></i> Search in RODZ Music <i class="fa fa-times w3-right w3-hover-text-red pointer" onclick="$('#results_container').fadeOut();"></i>
            </div>
            <div class="w3-padding-large w3-row" id="main_content" onmo>
                <h1>&nbsp;</h1>
            </div>
            <div class="w3-padding clearfix">
                <button class="btn btn-danger btn-sm float-right" onclick="$('#results_container').fadeOut();">Close</button>
            </div>
        </div>
    </div>
</div>
<font id="play_list_store" style="display:none"></font>
<div id="reusable"></div>
<?php 
$files = [
    'components/Player.js', 
    'components/BottomPlayerLayout.js', 
    'components/MobileView.js',
    'components/ShowSnack.js',
    'components/Web.js'
];
foreach($files as $file){
    echo "<script type=\"text/babel\">".file_get_contents($file)."</script>";
}
?>
</body>
<script type="text/javascript">
    var artist_id = "<?=$artist_id;?>";
    var search_container = null;
    var play_list = [], current_list = [];
    var play_index = 0;

    $(document).on('mouseenter', '.song', function(event){
        var id = $(this).attr('unik');
        $('#playIcon'+id).show();
        $('#bottomBar'+id).show();
    })

    $(document).on('mouseleave', '.song', function(event){
        var id = $(this).attr('unik');
        $('#playIcon'+id).hide();
        $('#bottomBar'+id).hide();
    })

    $(document).on('click', '.song', function(event){
        var id = $(this).attr('data');
        window.location = 'song/?id='+id;
    });

    

    function songView(obj) {
        var main = new Rodz.Div();
        main.setOrientation(LinearLayout.VERTICAL);
        main.addClasses(['w3-col', 'song', 'w3-padding', 'pointer', 'follow']);
        main.setAttribute('data', obj.song_id);
        main.setAttribute('unik', obj.unik);

        var displayContainer = new Rodz.Div();
        main.addView(displayContainer);
        displayContainer.addClasses(['w3-display-container']);
        displayContainer.view.style.overflow = 'hidden';

        var imgCont = new Rodz.Div();
        displayContainer.addView(imgCont);

        var iv = new Rodz.ImageView();
        iv.setAttribute('src', 'artwork/'+obj.resampled_artwork);
        iv.setAttribute('width', '100%');
        iv.addClasses(['rounded']);
        imgCont.addView(iv);

        var playCont = new Rodz.Div();
        playCont.addClasses(['w3-display-middle', 'w3-container']);
        displayContainer.addView(playCont);

        var play = new Rodz.Icon();
        play.addClasses(['fa-play', 'fa-3x', 'w3-text-white', 'w3-hover-text-red']);
        play.setAttribute('id', 'playIcon'+obj.unik);
        playCont.addView(play);
        play.view.style.display = 'none';

        var bottomBar = new Rodz.Div();
        bottomBar.addClasses(['w3-display-bottomright', 'w3-container', 'w3-padding-large']);
        bottomBar.setAttribute('id', 'bottomBar'+obj.unik);
        displayContainer.addView(bottomBar);
        bottomBar.view.innerHTML = '<span class="badge badge-info">'+obj.downloads+' <i class="fa fa-arrow-down"></i></span> <span class="badge badge-warning">'+obj.rating+' <i class="fa fa-star"></i></span>';
        bottomBar.view.style.display = 'none';

        var textContainer = new Rodz.Div();
        textContainer.addClasses(['w3-padding-small']);
        main.addView(textContainer);

        textContainer.view.innerHTML = '<font>'+obj.title+'</font><br><p class="w3-small fade-text2">'+obj.artist+'</p>';

        return main;
    }

    function printData(obj, content) {
       content.setOrientation(LinearLayout.VERTICAL);
        //Toast(obj.length);
        for(var category of obj){
            var headContainer = new Rodz.Div();
            headContainer.addClasses(['clearfix', 'w3-padding']);
            var head = new Rodz.Label();
            head.setText(category.label);
            head.addClasses(['w3-large', 'pointer', 'w3-hover-text-purple', 'moreBtn']);
            head.setAttribute('data', category.id);
            headContainer.addView(head);
            var more = new Rodz.Button();
            more.setText("See more");
            more.addClasses(['btn', 'btn-sm', 'btn-tag', 'float-right', 'moreBtn']);
            more.setAttribute('data', category.id);
            headContainer.addView(more);
            content.addView(headContainer);

            //print the products
            var productRow = new Rodz.Div()
            content.addView(productRow);
            productRow.addClasses(['w3-row', 'mb-30', 'categoryRow']);
            //Toast(category.products.length);

            try{
                for(var product of category.products){
                    var song = songView(product);
                    productRow.addView(song);
                }
            }
            catch(E){
                alert(E.toString());
            }
        }
    }

    $(document).ready(function(event) {

        $.get("handler.php?getArtistSongs="+artist_id+"&sort=top&count=6", function(response, status) {
            try{
                var rows = JSON.parse(response);

                var printRow = function(row) {
                    var div = new Rodz.Div();
                    div.addClasses(['w3-row', 'w3-border-top', 'w3-hover-light-grey', 'pointer']);
                    div.css('padding-top', '6px');
                    div.css('padding-bottom', '6px');

                    var ivContainer = new Rodz.Div();
                    ivContainer.addClasses(['w3-col m2', 'w3-center'])

                    var center = new Rodz.Div();
                    center.addClasses(['w3-col m8', 'pl-10'])

                    var right = new Rodz.Div();
                    right.addClasses(['w3-col m2', 'w3-center', 'pt-10']);

                    div.addAll(ivContainer, center, right);

                    var iv = new Rodz.ImageView();
                    iv.setSource("artwork/"+row.resampled_artwork);
                    iv.setAttribute('width', '75%');
                    iv.addClasses(['rounded']);
                    ivContainer.addView(iv);

                    var title = new Rodz.Label();
                    title.setText(row.title);
                    title.addClasses(['block', 'roboto']);
                    center.addView(title);

                    var artist = new Rodz.Label();
                    artist.setText(row.artist);
                    artist.addClasses(['block', 'roboto', 'w3-small']);
                    center.addView(artist);

                    var icon = new Rodz.Icon();
                    icon.addClasses(['fa fa-ellipsis-h', 'w3-large', 'pointer', 'w3-hover-text-blue']);
                    right.addView(icon);

                    return div;
                }

                var i = 0;
                for(var row of rows){
                    if (i < 3) {
                        var cont = new Rodz.Div('top1');
                        cont.addView(printRow(row));
                    }
                    else{
                        var cont = new Rodz.Div('top2');
                        cont.addView(printRow(row));
                    }
                    i += 1;
                }
            }
            catch(E){
                alert(E.toString()+response);
            }
        })

        $.get("handler.php?getAllSongs="+artist_id,(response, status) => {
            try{
                var rows = JSON.parse(response);
                $('#play_list_store').html(response);
                play_list = current_list = rows;
                printThePlayer(rows);
            }
            catch(E){
                alert(E.toString());
            }
        })

        $.get("handler.php?getArtists", function(response, status) {
            try{
                var rows = JSON.parse(response);

                var container = new Rodz.Div('all_artists');

                var artistView = function(row) {
                    var cont = new Rodz.Div();
                    cont.addClasses(['w3-col', 'artistClick', 'pointer']);
                    cont.setAttribute('data', row.id);
                    cont.setWidth((container.view.clientWidth-8) /8);

                    var cont2 = new Rodz.Div();
                    cont2.addClasses(['w3-center'])
                    cont.addView(cont2)

                    var iv = new Rodz.ImageView();
                    iv.setSource("profiles/"+row.photo);
                    iv.setAttribute('width', '60%');
                    iv.view.style.borderRadius = '50%';
                    //iv.addClasses(['block'])
                    cont2.addView(iv);

                    cont2.view.appendChild(document.createElement("br"));

                    var name = new Rodz.Label();
                    name.setText(row.name);
                    name.addClasses(['block', 'roboto']);
                    cont2.addView(name);
                    return cont;
                }

                for(var row of rows){
                    container.addView(artistView(row));
                }
            }
            catch(E){
                alert(E.toString()+response);
            }
        })
    });

    function change_language() {
        var language = $('#language_pack').val();
        if (language != "") {
            language = language.toLowerCase();
            window.location = '?language='+language;
        }
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

    function submit1() {
        var key_code = $('#key_code').val();
        $('#results_container').show();
        $('#main_content').load("rest_api.php?key_code="+key_code);
    }

    /*$(document).ready(function(event) {
        var bar = new Rodz.Div();
        bar.setWidth(window.innerWidth);
        bar.addClasses(['w3-white', 'w3-border-top', 'w3-row']);
        bar.css('position', 'fixed').css('bottom', '0').css('right', '0').css('z-index', '20');

        var ivContainer = new Rodz.Div();
        ivContainer.addClasses(['w3-col', 'w3-padding']);
        ivContainer.setWidth(60);
        bar.addView(ivContainer);

        var iv = new Rodz.ImageView();
        iv.setSource("artwork/23002_32522.png");
        iv.setWidth(40);
        iv.addClasses(['rounded']);
        ivContainer.addView(iv);

        var titleContainer = new Rodz.Div();
        titleContainer.addClasses(['w3-col', 'm3', 'w3-padding']);
        bar.addView(titleContainer);

        var title = new Rodz.Label();
        title.addClasses(['roboto', 'block']);
        title.setText("So good to be home");
        titleContainer.addView(title);

        var artist = new Rodz.Label();
        artist.setText("Coco Jones");
        titleContainer.addView(artist);

        LayoutInflator.inflate('play', bar.view, function() {});

        document.body.appendChild(bar.view);
    }); */

    $(document).on('mouseover', '#progress', function(event) {
        //create at tool tip
        //Toast("hello");
        createToolTip(event);
    })

    $(document).on('mousemove', '#progress', function(event) {
        //create at tool tip
        //Toast("hello");
        createToolTip(event);
    })

    function createToolTip(event) {
        var elem = event.target;
        var x = event.clientX;
        var y = event.clientY;
        $('#current').html(x);

        $('.tooltip2').remove();

        var div = new Rodz.Div();
        div.css('position', 'fixed').css('bottom', "40px").css('left', x+"px").css('z-index', 30);
        div.addClasses(['shadow', 'w3-padding-small', 'w3-red', 'rounded', 'tooltip2']);
        div.view.innerHTML = x;
        document.body.appendChild(div.view);
    }

    $(document).on('click', '.artistClick', function(event) {
        var id = $(this).attr('data');
        window.location = 'artist.php?id='+id;
    })
</script>
<script type="text/babel">
<?php require 'player.js';?>
</script>
</html>