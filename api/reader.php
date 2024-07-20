<?php
require "../db.php";
require '../includes/Interests.php';
require '../includes/FetchSongs.php';
require '../includes/Artists.php';

if(isset($_GET['getHome'])){
    $country = 91;
    $user = 13;
    
    //get top mixes
    $data = [
        'countries'=>[],
        'artists'=>[],
        'artist_ids' => [],
        'songs'=>[],
    ];

    $read = $db->query("SELECT DISTINCT song,web_artists.id,country FROM song_plays JOIN web_songs ON song_plays.song = web_songs.id JOIN web_artists ON web_songs.artist = web_artists.id WHERE user = '$user'");
    while ($row = $read->fetch_assoc()) {
        if (!in_array($row['country'], $data['countries'])) {
            array_push($data['countries'], $row['country']);
        }
        if (!in_array($row['id'], $data['artist_ids'])) {
            array_push($data['artists'], [$row['id'],$row['country']]);
            array_push($data['artist_ids'], $row['id']);
        }
        
        array_push($data['songs'], $row);
    }

    //separate artists by countries
    $country_limit = 4;
    $rows = [];
    for($i = 0; $i < count($data['countries']);$i++){
        if ($i < $country_limit) {
            //get the artist names
            $names = [];
            $song_list = [];

            foreach ($data['artists'] as $line) {
                $id = $line[0];
                $country_id = $line[1];
                if ($country_id == $data['countries'][$i]) {
                    $artist_data = $db->query("SELECT * FROM web_artists WHERE id = '$id' ")->fetch_assoc();
                    if (count($names) < 4) {
                        //echo $id;
                        $name = $artist_data['name'];
                        array_push($names, $name);
                    }
                    $temp_ids = [];
                    foreach ($data['songs'] as $song_row) {
                        if ($song_row['id'] == $id) {
                            array_push($temp_ids, $song_row['song']);
                        }
                    }

                    $where = "";
                    if (count($temp_ids) > 0) {
                        $where = " WHERE id IN (".implode(",",$temp_ids).") ";
                    }

                    if ($artist_data != null) {
                        $read = $db->query("SELECT * FROM web_songs $where ");
                        while ($song_row = $read->fetch_assoc()) {
                            $song_data['artist_data'] = $artist_data;
                            array_push($song_list, $song_data);
                        }
                    }
                }
            }
            //get artwork
            $row['artwork'] = 'default.png';
            $row['names'] = implode(", ", $names)." and more";
            $row['country'] = $data['countries'][$i];
            $row['songs'] = $song_list;
            array_push($rows, $row);
        }
        else{
            array_push($rows, ['type' => 'empty']);
        }
    }

    echo json_encode($rows);
}
elseif (isset($_GET['weeklyRelease'])) {
    $artists = Interests::favArtists($db,13);
    $followed = Interests::followedArtists($db,13);

    $all = [...$artists, ...$followed];
    //shuffle($all);
    
    //$arrays = [];
    $inline_artists = [];

    //SPLIT artists
    /*for ($i=0; $i < ceil(count($all) / 10); $i++) { 
        if(count($arrays) < 5){
            $chunk = array_slice($all, $i*10, ($i+1)*10);
            array_push($arrays,$chunk);
            $inline_artists = [...$inline_artists, ...$chunk];
        }
    }*/
    $arrays = Artists::byCountries($db,$all);

    //get artists and keep them
    $artist_store = [];
    $read = $db->query("SELECT * FROM web_artists WHERE id IN (".implode(",",$all).")");
    while ($row = $read->fetch_assoc()) {
        $artist_store[$row['id']] = $row;
    }

    $mega = [];
    foreach ($arrays as $country => $artists) {
        $first = $artist_store[$artists[0]];
        $names = [];

        $songs = [];
        foreach ($artists as $artist) {
            $songs = [...$songs, ...FetchSongs::topSongs($db, 13, $artist)];

            if (count($names) < 3) {
                array_push($names, $artist_store[$artist]['name']);
            }
        }

        shuffle($songs);
        $song_list = [];
        $read = $db->query("SELECT * FROM web_songs WHERE id IN (".implode(",",$songs).")");
        while ($row = $read->fetch_assoc()) {
            $row['artist_data'] = $artist_store[$row['artist']];
            array_push($song_list, $row);
        }

        $record['artwork'] = $first['photo'];
        $row['names'] = implode(", ", $names)." and more";
        //$row['country'] = $data['countries'][$i];
        $row['songs'] = $song_list;
        array_push($mega, $row);
    }

    echo json_encode($mega);
}
?>