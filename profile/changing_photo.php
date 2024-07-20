<?php
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
session_start();
$dbx = new sqlite3("../dt/src/main.db");
require '../functions.php';
if (isset($_SESSION['user_id'], $_SESSION['name'], $_SESSION['email'])) {
    $id = $user_id = $_SESSION['user_id'];
    $name = $_SESSION['name'];
    $email = $_SESSION['email'];

    //read from the database file
    $res = $dbx->prepare("SELECT * FROM users WHERE id = :id");
    $res->bindValue(':id', $user_id);
    $result = $res->execute();
    $row = $result->fetchArray();
    $user_status = $row['status'];
    $phone = $row['phone'];


    require 'imageClass.php';

    //$my = new rodz;

    $imag = new rodzImage;

    //hashing post id
    $uni = time();
    $hashe = "$uni $id";
    $hashed = md5($hashe);
    $link = "../images/";

    if(isset($_FILES['image'])){

        $file_name = $_FILES['image']['name'];
        $file_size =$_FILES['image']['size'];
        $file_tmp =$_FILES['image']['tmp_name'];
        $file_type=$_FILES['image']['type'];

        $final_name = $uni."_".$file_name;

        //get file extension

        $ext = fileExt($file_name);

        if ($ext == "jpg" || $ext == "png" || $ext == "gif" || $ext == "jpeg"){
            $me = "Okay";
            if($file_size >12197152){
                echo 'File size must not be larger than 2 MB';
            }
            if($me == "Okay"){
                move_uploaded_file($file_tmp,"$link".$final_name);

                $true_link = "$link".$final_name;

                $rrobert = $dbx->query("INSERT INTO `member_photos`(`id`, `userId`, `file`) VALUES (NULL, '$id', '$true_link')");
                if (!$rrobert) {
                    echo "Error in iserting". $dbx->lastErrorMsg();
                }
                echo "<img src='$true_link' style=\"width:200px;box-shadow:0 0 0 .2rem rgba(0,200,123,.45)\" onclick=\"miniProfile();\">";

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
    echo json_encode(['status' => true, 'message' => 'There is no user session']);
}
        
?>