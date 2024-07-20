<?php
//$dbx->exec("CREATE TABLE IF NOT EXISTS week_sort (id )")
$today = date('Y-m-d');
$rd = $dbx->query("SELECT COUNT(`day`) AS count FROM week_sort WHERE day = '$today' ");
$d = $rd->fetchArray();
$limits = [5, 10, 15];
if ($d['count'] < 1) {
    //fetching songs to be put on the list
    $max = time();
    $min = $max - (3600*24*7);

    $selective_download = $dbx->query("SELECT DISTINCT song_id FROM downloads WHERE `time` BETWEEN $min AND $max");
    $songs = [];

    while ($row = $selective_download->fetchArray()) {
        $check_download = $dbx->query("SELECT COUNT(`id`) AS count FROM downloads WHERE song_id = '".$row['song_id']."' ");
        $count_data = $check_download->fetchArray();
        $songs[$row['song_id']] = $count_data['count'];
    }

    //sort the array
    arsort($songs);
    $sorted_id = [];

    foreach ($songs as $key => $value) {
        array_push($sorted_id, $key);
    }

    $str_of_songs_id = implode(",", $sorted_id);

    //insert the record
    $ins = $dbx->prepare("INSERT INTO week_sort (id, day, songs) VALUES(NULL, :day, :songs)");
    $ins->bindValue(':day', $today);
    $ins->bindValue(':songs', $str_of_songs_id);
    $ins->execute();
}
else{
    //get the list of songs id from the table
    $rd = $dbx->query("SELECT * FROM week_sort WHERE day = '$today' ");
    $d = $rd->fetchArray();
    $ids_str = $d['songs'];
    $sorted_id = explode(",", $ids_str);
}
//get the songs

//check for mobile and desktop view
if ($device_type == "mobile") {
    # code...
}
$width = count($sorted_id) * 200;
echo "<div style=\"width: ".$width."px;\" class='scrollbar1'>";
for ($i=0; $i < count($sorted_id); $i++) { 
    $song_id = $sorted_id[$i];

    $sql = $dbx->query("SELECT *, songs.id AS song_id FROM songs INNER JOIN files ON songs.file_id = files.id WHERE songs.id = '$song_id' ");
    $row = $sql->fetchArray();

    if (strlen($row['resampled_artwork']) > 4) {
        $artwork = $row['resampled_artwork'];
    }
    else{
        $artwork = $row['artwork'];
    }
    ?>

    <div class="w3-col w3-padding pointer" style="width: 200px; float: left;">
        <div class="w3-display-container" onmouseenter="$(this).addClass('shadow')" onmouseleave="$(this).removeClass('shadow')" onclick="window.location = 'song/?id=<?php echo $row['song_id'];?>' ">
            <div style="height: 200px;overflow-y: hidden;"><img src="artwork/<?php echo $artwork;?>" width="100%" class="rounded"></div>
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
echo "</div>";
?>