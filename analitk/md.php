<?php
require ('../db.php');
/*
$read = $db->query("SELECT id FROM `web_artists` WHERE photo LIKE '%mdundo%';");
$all = [];
while($row = $read->fetch_assoc()){
    array_push($all, $row['id']);
}
$text = implode(",", $all);
file_put_contents("save.txt", $text);
echo $text;*/

$ids = explode(",", file_get_contents("save.txt"));

$delete_ids = [];

$five_hundred = array_slice($ids, 0,500);
$left = array_slice($ids,500);

foreach($five_hundred as $artist){
    $songs = (int)$db->query("SELECT COUNT(id) AS count_all FROM web_songs WHERE artist = '$artist' ")->fetch_assoc()['count_all'];
    if($songs == 0){
        array_push($delete_ids, $artist);
    }
}

if(count($delete_ids) > 0){
    $db->query("DELETE FROM web_artists WHERE id IN (".implode(",", $delete_ids).")");
    echo "deleted ".count($delete_ids)."::   ";
}

//save the remaining
$text = implode(",", $left);
file_put_contents("save.txt", $text);
if(count($left) > 0){
    echo count($left)." remaining";
    ?>
    <script type="text/javascript">
        window.onload = function(){
            setTimeout(()=>{
                window.location ='md.php';
            }, 100);
        }
    </script>
    <?php
}
else{
    echo "Probably finished";
}
?>