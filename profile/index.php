<?php
session_start();
require '../db.php';
require '../functions.php';
visit("profile");

require '../device.php';
$client = new client_info;
$client_os = $client->os;
$client_browser = $client->browser_name;
$device_type = $client->device;
$_SESSION['device'] = $device_type;


if (isset($_SESSION['user_id'], $_SESSION['name'], $_SESSION['email'])) {
    $user_id = $_SESSION['user_id'];
    $name = $_SESSION['name'];
    $email = $_SESSION['email'];

    //read from the database file
    $res = $dbx->query("SELECT * FROM users WHERE id = '$user_id' ");
    $row = $res->fetch_assoc();
    $user_status = $row['status'];
    $_SESSION['phone'] = $phone = $row['phone'];

    $sql = $dbx->query("SELECT * FROM member_photos WHERE userId = '$user_id' ORDER BY id DESC LIMIT 1");
    $ic = 0;
    while($data = $sql->fetch_assoc()){
        $file = $data['file'];
        $ic += 1;
    }
    if ($ic > 0) {
        # //do nothing...
    }
    else{
        $file = "../images/pro_file.jpg";
    }
}
else{
    header("location: ../signin/?session_clear=true");
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>RODZ Music - Stream and Purchase Music</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="../w3css/w3.css">
    <link rel="stylesheet" type="text/css" href="../vendor/bootstrap/css/bootstrap.min.css">
    <script type="text/javascript" src="../vendor/jquery/jquery.min.js"></script>
    <script type="text/javascript" src="../vendor/bootstrap/js/bootstrap.min.js"></script>
    <link rel="stylesheet" type="text/css" href="../semantic/semantic.min.css">
    <link rel="stylesheet" type="text/css" href="../fontawesome/css/all.css">
    <script src="js/sweetalert.min.js"></script>
    <!--dataTables links -->
    <script type="text/javascript" src="../vendor/jquery/jquery.min.js"></script>
    
    <link rel="stylesheet" type="text/css" href="../datatables/media/css/jquery.dataTables.css">
    <link rel="stylesheet" type="text/css" href="../datatables/examples/resources/syntax/shCore.css">
    <script type="text/javascript" language="javascript" src="../datatables/media/js/jquery.js"></script>
    <script type="text/javascript" language="javascript" src="../datatables/media/js/jquery.dataTables.js"></script>
    <script type="text/javascript" language="javascript" src="../datatables/media/js/jquery.dataTables.min.js"></script>
    <script type="text/javascript" language="javascript" src="../datatables/examples/resources/syntax/shCore.js"></script>
    <script type="text/javascript" language="javascript" src="../datatables/examples/resources/demo.js"></script>
    <script type="text/javascript" src="../modernizr-2.6.2-respond-1.1.0.min.js"></script>

    <!--Table exporting plugin-->
    <script type="text/javascript" src="libs/js-xlsx/xlsx.core.min.js"></script>
    <script type="text/javascript" src="libs/FileSaver/FileSaver.min.js"></script>
    <script type="text/javascript" src="libs/jsPDF/jspdf.min.js"></script>
    <script type="text/javascript" src="libs/jsPDF-AutoTable/jspdf.plugin.autotable.js"></script>
    <script type="text/javascript" src="libs/es6-promise/es6-promise.auto.min.js"></script>
    <script type="text/javascript" src="libs/html2canvas/html2canvas.min.js"></script>
    <!--<![endif]-->
    <script type="text/javascript" src="tableExport.js"></script>
    <script src="js/sweetalert.min.js"></script>
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
        }
    </style>
</head>
<body>
    <?php
    if ($user_status == "registered") {
        ?>
        <div class=" w3-padding w3-row">
            <div class="w3-col m4">&nbsp;</div>
            <div class="w3-col m4">
                <div class="bg w3-padding">
                    <font class="w3-large"><i class="fa fa-music w3-text-orange"></i> RODZ MUSIC</font>
                </div>
            
                <div class="w3-padding">
                    <h2>Verify phone number</h2>
                    <p>Welcome <b><?="$name";?></b>. To start using these services, you need to verify your phone number</p>
                    <p>We are going to send a confirmation code to +265XXXXX<?php echo substr($phone, strlen($phone)-4);?></p>
                    <button class="btn btn-sm bg" onclick="$('#use_another').hide();sendCode();">Yes, send code</button> <button class="btn btn-sm" onclick="$('#confirm_code').hide();$('#use_another').slideToggle()">No, i will use another number</button>
                    <div id="confirm_error"></div>
                    <br><br>
                    <form id="use_another" style="display: none;">
                        <p>Enter the new phone number</p>
                        <p><input type="text" name="new_phone" class="form-control border" placeholder="Phone number"></p>
                        <p><input type="submit" name="submit" class="btn bg" value="Send Code"></p>
                    </form>
                    <form id="confirm_code" style="display: none;">
                        <p>Enter the code you have received</p>
                        <p><input type="text" name="confirmation_code" class="form-control border" placeholder="Confirmation code" minlength="4" maxlength="4" required></p>
                        <p><input type="submit" name="submit" class="btn bg" value="Confirm"></p>
                    </form>
                </div>
            </div>
        </div>
        <?php
    }
    else{
        if ($device_type == "mobile") {
            ?>
            <div class="bg w3-padding-large w3-row">
                <font class="w3-large"><i class="fa fa-music w3-text-orange"></i> RODZ MUSIC <i class="fa fa-bars w3-right w3-text-orange pointer" onclick="$('#nav_mobile_modal').show();"></i></font>
            </div>
            <div class="bg w3-padding w3-row">
                <div class="w3-col m6 s12 w3-padding">
                    <button class="btn btn-danger w3-round-jumbo tpbtn" data="create_upload">Upload</button> <button class="btn bg w3-text-white tpbtn" data="my_songs">Songs</button> <button class="btn bg w3-text-white tpbtn" data="statistics">Statistics</button> <button class="btn bg w3-text-white tpbtn" data="profile">Profile</button>
                </div>
            </div>
            <?php
        }
        else{
            ?>
            <div class="bg w3-padding w3-row">
                <div class="w3-col m1">&nbsp;</div>
                <div class="w3-col m6 w3-padding">
                    <font class="w3-large"><i class="fa fa-music w3-text-orange"></i> RODZ MUSIC</font> <button class="btn btn-danger w3-round-jumbo tpbtn" data="create_upload">Upload a song</button> <button class="btn bg w3-text-white tpbtn" data="my_songs">My Songs</button> <button class="btn bg w3-text-white tpbtn" data="statistics">Statistics</button> <button class="btn bg w3-text-white tpbtn" data="profile">Profile</button>
                </div>
                <div class="w3-col m5 clearfix w3-padding">
                    <button class="btn btn-outline-info pointer btn-sm w3-round-jumbo" onclick="window.location = '../signin/?session_clear=true' ">Sign Out</button>
                </div>
            </div>
            <br>
            <?php
        }
        require '../mobile_nav.php';
        ?>
    <div class="w3-row major" id="create_upload">
        <div class="w3-col m3">&nbsp;</div>
        <div class="w3-col m6" id="upload_content">
            <h1>Create a Music Upload</h1>
            
            <p>To upload a song, you need to make a deposit of a non refundable fee of MWK 2000. Send money through <?php echo get_network_carrier($phone)[1]; ?> to us <b>(rodz Music, <?php echo get_network_carrier($phone)[2]; ?>)</b>, using <?="$phone";?> your <?php echo get_network_carrier($phone)[0]; ?> number you had used to register as an artist here</p>
            <p>Or, you can use your balance, (money sourced from sales) to pay for music upload.</p>
            
            <button class="btn bg w3-text-white" onclick="$('#file1').click()">Choose song file</button>
            <p>&nbsp;</p>
            <div id="uploadMaster" style="display: none;">
                <progress value="0" max="100" id="progressBar"></progress>
                <div id="uploadStatus"></div>
            </div>
        </div>
    </div>
    <div class="w3-row major" id="statistics" style="display: none;">
        <div class="w3-col m3">&nbsp;</div>
        <div class="w3-col m6" id="upload_content">
            <h1>Your usage statistics</h1>
        </div>
    </div>
    <div class="w3-row major w3-padding-small" id="profile" style="display: none;">
        <div class="w3-col m2">&nbsp;</div>
        <div class="w3-col m8" id="upload_content">
            <h1>Your Profile</h1>
            <div class="w3-row">
                <div class="w3-col m4">
                    <center>
                        <div id="profilePic"><img src="<?="$file";?>" width="200"></div>
                        
                        <p>&nbsp;</p>
                        <div id="uploadMaster" style="display: none;">
                            <progress value="0" max="100" id="progressBar"></progress>
                            <div id="uploadStatus"></div>
                        </div>
                        <button class="btn bg btn-sm" onclick="window.location = 'photo_changer.php' "><i class="fa fa-camera"></i> Change photo</button>
                    </center>
                </div>
                <div class="w3-col m8 w3-padding-right">
                    <h5>Personal details</h5>
                    <div class="w3-padding w3-border-bottom">
                        Username: <b><?="$name";?></b> <i class="fa fa-pen-alt w3-hover-text-red w3-right pointer" onclick="profile(1)"></i>
                    </div>
                    <div class="w3-padding w3-border-bottom">
                        Phone number: <b><?="$phone";?></b> <i class="fa fa-pen-alt w3-hover-text-red w3-right pointer" onclick="profile(3)"></i>
                    </div>
                    <div class="w3-padding w3-border-bottom">
                        Account type: <b>Member</b> <font class="text-danger w3-small w3-right">Not editable</font>
                    </div>
                    <br><br>
                    <button class="btn bg btn-sm" onclick="profile(4)"><i class="fa fa-unlock-alt"></i> Change password</button>
                    <br><br>
                    <a class="btn-sm btn btn-outline-secondary" href="../methods/logout.php"><i class="fa fa-sign-out-alt"></i> Logout</a>
                </div>
            </div>
        </div>
    </div>
    <div class="w3-row major" id="my_songs" style="display: none;">
        <div class="w3-col m2">&nbsp;</div>
        <div class="w3-col m8" id="upload_content">
            <h1>My Music Uploads</h1>
            <div class="w3-padding-responsive">
                <table id="example90" class="display" style="width:100%">
                    <thead>
                        <tr>
                            <th>#</th><th>Title</th><th>Artist</th><th>Genre</th><th>Price</th><th>Artwork</th><th>Date Uploaded</th><th>Downloads</th><th>Rating</th><th style="width: 10%">Action</th>
                        </tr>
                    </thead>
                    <tbody id="allhospitals">
                        
                        <?php
                        $sql = $dbx->query("SELECT *, songs.id AS song_id FROM songs INNER JOIN users ON songs.user_id = users.id WHERE user_id = '$user_id' ");
                        $i = 1;
                        while ($row = $sql->fetch_assoc()) {
                            if (strlen($row['resampled_artwork']) > 5) {
                                $artwork = $row['resampled_artwork'];
                            }
                            else{
                                $artwork = $row['artwork'];
                            }
                            echo "<tr><td>$i</td><td>{$row['title']}</td><td>{$row['artist']}</td><td>".genre($row['genre'])."</td><td>{$row['price']}</td><td><img src='../artwork/".($artwork)."' width='40'></td><td>".date('d M Y H:i A', $row['date_added'])."</td><td>".get_download($row['song_id'])."</td><td>".strip_tags(get_rating($row['song_id']))."</td><td><a class=\"btn btn-sm btn-warning hospital_edit\" data=\"{$row['song_id']}\"><i class=\"fa fa-pen-alt\"></i></a> <a class=\"btn btn-sm btn-danger song_delete\" data=\"{$row['song_id']}\" textContent=\"{$row['name']}\"><i class=\"fa fa-trash\"></i></a></td></tr>";
                            $i += 1;
                        }
                        ?>
                    </tbody>

                </table><br>
            </div>
        </div>
    </div>
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    

    <div class="w3-modal" id="modal_payment" style="padding-top: 20px;">
            <div class="w3-modal-content w3-card-16 w3-round-large" style="width: 400px;padding-bottom: 30px;">
                <div class="w3-padding-large bg rounded-top">
                    Confirm payment
                </div>
                <div class="w3-padding-large w3-row" id="confirm_container">
                    <p id="check_balance_report">MWK 2000 will be deducted from your balance. We are going to send a confirmation to <?="$phone";?></p>
                </div>
                <div class="w3-padding clearfix">
                    <button class="btn bg" onclick="$(this).hide();get_confirmation_code();">Yes</button><button class="btn btn-danger float-right" onclick="$('#modal_payment').fadeOut();">Close</button>
                </div>
            </div>
        </div>

    <?php
    if (isset($_GET['start'])) {
        ?>
        <div class="w3-modal" id="terms_modal" style="padding-top: 20px;display: block;">
            <div class="w3-modal-content w3-card-16 w3-round-large" style="width: 500px;padding-bottom: 30px;">
                <div class="w3-padding-large bg rounded-top">
                    Terms and conditions
                </div>
                <div class="w3-padding-large w3-row" id="terms_container">
                    <h3>Music Selling</h3>
                    <p>RodzMusic employs Airtel money and TNM mpamba to get money from the customers which are possibly your fanz.</p>
                    <p>Each transaction made to any of your song is recorded that you can see under your statistics in the profile menu. You are required to withdraw your money at a weekly interval <b>(Not daily/by wish)</b></p>
                </div>
                <div class="w3-padding clearfix">
                    <button class="btn bg" onclick="$('#terms_modal').fadeOut();">Okay, I agree</button>
                </div>
            </div>
        </div>
        <?php
    }
    ?>
<div class="w3-modal" id="toast_modal" style="padding-top: 20px;">
    <div class="w3-modal-content w3-card-16 w3-padding-large alert-success w3-round-large w3-animate-top" id="toast_content" onclick="this.parentElement.style.display = 'none'"></div>
</div>
<div class="w3-hide">
    <input type="file" name="image" id="file1" onchange="uploadFile()" class="w3-hide" accept="audio/mp3">
</div>
    <?php
    }
    ?>
</body>
<script type="text/javascript" src="http://localhost/resources/rodz.js"></script>
<script type="text/javascript">

    function get_confirmation_code() {
        
        $('#confirm_container').load("rest_api.php?confirm_upload");
    }
    $(document).ready(function() {
        $('#example90').DataTable();
    });

    $('.tpbtn').click(function (event) {
        event.preventDefault();
        var target = $(this).attr('data');
        $('.tpbtn').removeClass('btn-danger').removeClass('w3-round-jumbo').addClass('bg').addClass('w3-text-white');
        $(this).removeClass('w3-text-white').removeClass('bg').addClass('btn-danger').addClass('w3-round-jumbo');
        $('.major').hide();
        $('#'+target).fadeIn(200);
    });


    $(document).ready(function() {
        <?php
        if (isset($_GET['success'])) {
            ?>
            swal({
                title: 'Success!',
                text: "Successfully added a new song record",
                icon: 'success'
            });
            <?php
        }

        if (isset($_GET['pic'])) {
            ?>
            swal({
                title: 'Success!',
                text: "Successfully uploaded a profile picture",
                icon: 'success'
            });
            <?php
        }
        ?>
    })
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
    });

    $('#use_another').on('submit', function(event) {
        event.preventDefault();
        var form_data = $(this).serialize();

        $.ajax({
            url: "sendCode.php",
            method: "POST",
            data: form_data,
            success: function(response) {
                try{
                    var obj = JSON.parse(response);
                    if (obj.status == true) {
                        $('#use_another').hide();
                        sendCode();
                    }
                    else{
                        $('#confirm_error').html(obj.message).addClass('text-danger');
                    }
                }
                catch(E){
                    alert(response);
                }
            }
        })
    })

    $('.bn').click(function (event) {
        event.preventDefault();
        var target = $(this).attr('data');
        $('.bn').removeClass('w3-blue').addClass('btn-blue');
        $(this).removeClass('btn-blue').addClass('w3-blue');
        $('.ts').hide();
        $('#'+target).fadeIn(200);
    });


    $('#confirm_code').on('submit', function(event) {
        event.preventDefault();
        var form_data = $(this).serialize();

        $.ajax({
            url: "sendCode.php",
            method: "POST",
            data: form_data,
            success: function(response) {
                try{
                    var obj = JSON.parse(response);
                    if (obj.status == true) {
                        window.location = 'index.php';
                    }
                    else{
                        $('#confirm_error').html(obj.message).addClass('text-danger');
                    }
                }
                catch(E){
                    alert(E.toString()+response);
                }
            }
        })
    })

    $(document).on('submit', '#confirm_code_1', function(event) {
        event.preventDefault();
        var form_data = $(this).serialize();

        $.ajax({
            url: "rest_api.php",
            method: "POST",
            data: form_data,
            success: function(response) {
                try{
                    var obj = JSON.parse(response);
                    if (obj.status == true) {
                        window.location = 'index.php';
                    }
                    else{
                        $('#code_error').html(obj.message).addClass('text-danger');
                    }
                }
                catch(E){
                    alert(response);
                }
            }
        })
    })

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

    function sendCode() {
        $.ajax({
            url:"sendCode.php",
            method:"POST",
            data: {sendCode:"true"},
            success: function(response) {
                try{
                    var obj = JSON.parse(response);
                    if (obj.status == true) {
                        $('#confirm_code').show();
                    }
                    else{
                        $('#confirm_error').html(obj.message);
                    }
                }
                catch(E){
                    alert(response);
                }
            }
        })
    }

    function get_ext(filename) {
        var chars = filename.split(".");
        var rev_arr = chars.reverse();
        return rev_arr[0];
    }

    function _(el) {
        return document.getElementById(el);
    }
    function uploadFile() {
        $('#uploadMaster').show();
        var file = _("file1").files[0];
        var file_ext = get_ext(file.name);

        var progressHandler = function(event) {
            var percent = (event.loaded / event.total) * 100;
            _("uploadStatus").innerHTML = Math.round(percent) + " % uploaded.... Please wait";
            $('#progressBar').val(Math.round(percent));
        }

        var completeHandler = function (event) {
            $('#uploadMaster').hide();
            _("upload_content").innerHTML = event.target.responseText;
        }

        var errorHandler = function (event) {
            _("uploadStatus").innerHTML = "Upload failed";
        }

        var abortHandler = function (event) {
            _("uploadStatus").innerHTML = "Upload Aborted";
        }
        
        var formdata = new FormData();
        formdata.append("image", file);
        var ajax = new XMLHttpRequest();
        //adding event listeners
        ajax.upload.addEventListener("progress", progressHandler, false);
        ajax.addEventListener("load", completeHandler, false);
        ajax.addEventListener("error", errorHandler, false);
        ajax.addEventListener("abort", abortHandler, false);
        ajax.open("POST", "upload.php");
        ajax.send(formdata);
        
    }
    
    $(document).on('submit', '#details_form', function(event) {
        event.preventDefault();

        var formdata = new FormData(event.target);

        post("api.php", formdata, function(response) {
            try{
                alert(response);
            }
            catch(E){
                alert(E.toString()+response);
            }
        })
    })
</script>
</html>