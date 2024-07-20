<?php
session_start();
require '../db.php';
require '../sms.php';
//require '../makwacha/db.php';
require '../validation.php';

if (isset($_SESSION['user_id'], $_SESSION['name'], $_SESSION['email'])) {
    $user_id = $_SESSION['user_id'];
    $name = $_SESSION['name'];
    $email = $_SESSION['email'];

    //read from the database file
    $res = $dbx->query("SELECT * FROM users WHERE id = '$user_id' ");
    $row = $res->fetch_assoc();
    $user_status = $row['status'];
    $phone = $row['phone'];
    $code = $row['code'];

    if (isset($_POST['sendCode'])) {
    	sendMessage($phone, "(rodzMusic) Your account verification code is $code");
    	echo json_encode(['status' => true, 'message' => 'Your confirmation message was sent']);
    }
    elseif (isset($_POST['confirmation_code'])) {
    	$code2 = $_POST['confirmation_code'];

    	if ($code == $code2) {
    		# update the main account...
    		$upd = $dbx->query("UPDATE users SET status = 'confirmed' WHERE id = '$user_id' ");
    	}
    	else{
    		echo json_encode(['status' => false, 'message' => 'Your code is incorrect']);
    	}
    }
    elseif (isset($_POST['new_phone'])) {
    	$new_phone = $_POST['new_phone'];

    	if (validate_phone($new_phone)[0] == true) {
    		
    		$new_phone = real_phone($new_phone);
	    	# update the main account...
			$upd = $dbx->query("UPDATE users SET phone = '$new_phone' WHERE id = '$user_id' ");
		}
		else{
			echo json_encode(['status' => false, 'message' => validate_phone($new_phone)[1]]);
		}
    }
    else{
    	echo json_encode(['status' => false, 'message' => 'Unable to detect specific task to do']);
    }
}
else{
    echo json_encode(['status' => false, 'message' => 'Unable to detect loggin sessions']);
}
?>