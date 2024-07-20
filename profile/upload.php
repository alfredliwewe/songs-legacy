<?php
if (!isset($_SESSION)) {
    session_start();
}
function fileExt($filename)
{
    # returns the extension only...
    $filename = strtolower($filename);

    //reverse the string
    $reversed = strrev($filename);

    $a = 0;
    $position = stripos($reversed, ".");
    if (isset($position)) {
        # file might be true but check if other points are available...
        $choped = substr($reversed, 0, $position);
        $ext = strrev($choped);
        return $ext;
    }
}
///connecting to the database
require '../db.php';

if (isset($_SESSION['user_id'], $_SESSION['name'], $_SESSION['email'])) {
    $user_id = $_SESSION['user_id'];
    $name = $_SESSION['name'];
    $email = $_SESSION['email'];

    //hashing post id
    $uni = time();
    $hashe = "$uni $user_id";
    $hashed = md5($hashe);
    $link = "../songs/";

    if(isset($_FILES['image'])){

        $file_name = $_FILES['image']['name'];
        $file_size =$_FILES['image']['size'];
        $file_tmp =$_FILES['image']['tmp_name'];
        $file_type=$_FILES['image']['type'];

        

        //get file extension

        $ext = fileExt($file_name);

        if ($ext == "mp3"){
            $final_name = $uni."_".$hashed.".".$ext;

            $me = "Okay";
            if($file_size >12197152){
                echo 'File size must not be larger than 2 MB';
                $me = "not okay";
            }
            elseif($me == "Okay"){
                move_uploaded_file($file_tmp,"$link".$final_name);

                $true_link = "$link".$final_name;

                $robert = $dbx->query("INSERT INTO files(id, user_id, file) VALUES (NULL, '$user_id', '$final_name')");
                if (!$robert) {
                    echo "Error in iserting - ". $dbx->error;
                }
                else{
                    echo "<audio controls><source src='$true_link' style=\"width:200px;box-shadow:0 0 0 .2rem rgba(0,200,123,.45)\"></audio>";
                    ?>
                    <h1>Add details to your uploaded Music</h1>
                    <form method="POST" enctype="multipart/form-data" id="details_form" action="api.php">
                        <p>Song Title:
                            <input type="text" name="title" class="form-control bb" placeholder="Song title" required>
                        </p>
                        <p>Supporting Artist:
                            <input type="text" name="artist" class="form-control bb" placeholder="Supporting artist">
                        </p>
                        <p>Choose genre:
                            <select class="form-control" name="genre">
                                <?php
                                $sql = $dbx->query("SELECT * FROM genre");
                                while ($row = $sql->fetch_assoc()) {
                                    echo "<option value=\"{$row['id']}\">{$row['name']}</option>";
                                }
                                ?>
                            </select>
                        </p>
                        <p>Price:
                            <input type="number" name="price" min="0" max="400" class="form-control bb" placeholder="Song price" required>
                        </p>
                        <p>Artwork file:
                            <input type="file" name="artwork" class="form-control border" placeholder="Song title" required>
                        </p>
                        <br>
                        <p>
                            <input type="submit" name="save_details" class="btn bg w3-text-white" value="Finish Up" placeholder="Song title">
                        </p>
                    </form>
                    <?php
                }
            }
        }
        else{
            ?>
            <div class="alert alert-danger">
              <strong>Warning!</strong> Unsupported file format!!
            </div>
            <?php
        }
    }
}
else{
    ?>
    <div class="alert alert-danger">
        <strong>Warning!</strong> User details not detected!!
    </div>
    <?php
} 
?>