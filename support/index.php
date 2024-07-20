<?php
session_start();
require '../validation.php';
if (isset($_COOKIE['user_id'], $_COOKIE['phone'], $_COOKIE['name'])) {
	$user = $_COOKIE['phone'];

}
elseif (isset($_GET['phone'])) {
	$phone = real_phone($_GET['phone']);
	setcookie("phone", $phone, time()+3600*24*30*12);
}
else{
	header("location: ../index.php");
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Rodzmusic Customer Support</title>
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
	<div class="w3-row">
		<div class="w3-col m4 w3-hide-small">&nbsp;</div>
	    <div class="w3-col m4" style="border:1px solid #000033;">
	        <div class="bg w3-padding">
	            <font class="w3-large"><i class="fa fa-comments w3-text-orange"></i> Rodzmusic Customer support</font>
	        </div>
	        <div class="w3-padding" id="main_content" style="height: 500px;overflow-y: auto;">
	            some content...
	        </div>
	        <div class="w3-row">
	        	<div class="w3-col s1 w3-padding">
	        		<center><i class="fa fa-paperclip w3-hover-text-blue pointer" id="attach"></i></center>
	        	</div>
	        	<div class="w3-col s9 m10 w3-padding-small">
	        		<input type="text" name="message" id="message" class="border w3-padding" placeholder="Type in here" style="width: 100%">
	        	</div>
	        	<div class="w3-col s1 w3-padding">
	        		<center><i class="fa fa-paper-plane w3-hover-text-blue pointer" id="send"></i></center>
	        	</div>
	        </div>
	    </div>
	</div>
</body>

<script type="text/javascript">
	$(document).ready(function(event) {
		start_service();
	});

	function start_service() {
		$.ajax({
			url: "api.php",
			method: "POST",
			data: {start:"true"},
			success: function(response) {
				$('#main_content').html(response);
			}
		})
	}

	$(document).on('click', '#send', function(event) {
		var message = $('#message').val();
		var html = "<div class='w3-row'><div class='w3-col s3'>&nbsp;</div><div class='w3-col s9 w3-padding-small'><div class='alert-secondary w3-padding w3-round-large'>"+message+"</div></div></div>";
		$('#main_content').html($('#main_content').html()+html);
		$('#message').val('');
		get_reply(message);
		$('#message').focus();
	});

	$(document).on('keyup', '#message', function(event) {
		if (event.keyCode === 13) {
			$('#send').click();
		}
	});

	function get_reply(message) {
		$.ajax({
			url: "api.php",
			method: "POST",
			data: {message:message},
			success: function(response) {
				$('#main_content').html($('#main_content').html()+response);
			}
		})
	}
</script>
</html>