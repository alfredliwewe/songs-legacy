<?php
session_start();
$dbx = new sqlite3("dt/src/main.db");
require 'functions.php';
require 'validation.php';
require 'makwacha/db.php';

if (isset($_GET['phone'])) {
	setcookie("phone", real_phone($GET['phone']), time()+3600*24*30*12*4);
	echo $GET['phone'];
}
elseif (isset($_POST['new_phone'], $_POST['full_name'], $_POST['song_id'])) {
	$sql = $dbx->prepare("SELECT COUNT(`phone`) AS count FROM visitors WHERE phone = :phone");
	$sql->bindValue(':phone', real_phone($_POST['new_phone']));
	$result = $sql->execute();

	$d = $result->fetchArray();
	if ($d['count'] > 0) {
		//take the details and login
		//echo json_encode(['status' => false, 'message' => 'The phone number is already taken']);
		/*
		$sql = $dbx->prepare("SELECT * FROM visitors WHERE phone = :phone");
		$sql->bindValue(':phone', real_phone($_POST['new_phone']));
		$result = $sql->execute();
		$data = $result->fetchArray();
		setcookie("user_id", $data['code'], time()+3600*24*30*12*4);
		setcookie("phone", $data['phone'], time()+3600*24*30*12*4);
		setcookie("name", $data['name'], time()+3600*24*30*12*4);
		*/
		$_SESSION['code'] = $code = rand(100001, 998989);
		$_SESSION['full_name'] = $_POST['full_name'];
		$_SESSION['new_phone'] = $_POST['new_phone'];

		sendMessage(real_phone($_POST['new_phone']), "(rodzMusic) Your user confirmation code is ".$code);
		echo json_encode(['status' => true, 'song_id' => (int)$_POST['song_id']]);
	}
	else{
		//start validations
		if (validate_phone($_POST['new_phone'])[0] == true) {
			if (validate_name($_POST['full_name'])[0] == true) {
				$_SESSION['code'] = $code = rand(100001, 998989);
				$_SESSION['full_name'] = $_POST['full_name'];
				$_SESSION['new_phone'] = $_POST['new_phone'];

				sendMessage(real_phone($_POST['new_phone']), "(rodzMusic) Your user confirmation code is ".$code);
				/*
				$uniqid = uniqid();
				$ins = $dbx->prepare("INSERT INTO visitors (id, phone, name, code, date) VALUES (NULL, :phone, :name, :code, :date)");
				$ins->bindValue(':phone', real_phone($_POST['new_phone']));
				$ins->bindValue(':name', $_POST['full_name']);
				$ins->bindValue(':code', $uniqid);
				$ins->bindValue(':date', time());
				$ins->execute();
				setcookie("user_id", $uniqid, time()+3600*24*30*12*4);
				setcookie("phone", $_POST['new_phone'], time()+3600*24*30*12*4);
				setcookie("name", $_POST['full_name'], time()+3600*24*30*12*4);
				$name = $db->real_escape_string($_POST['full_name']);
				$phone = real_phone($db->real_escape_string($_POST['new_phone']));

				$code = rand(1001, 9990);
				$time = time();
				//create a new makwacha account 
				$new_account = $db->query("INSERT INTO `members`(`id`, `first`, `last`, `phone`, `password`, `uniqued`, `balance`, `registered`, `status`) VALUES (NULL, '$name', '', '$phone', '1234', '$code', '0', '$time', 'registered')");
				*/
				echo json_encode(['status' => true, 'song_id' => (int)$_POST['song_id']]);
			}
			else{
				echo json_encode(['status' => false, 'message' => validate_name($_POST['full_name'])[1]]);
			}
		}
		else{
			echo json_encode(['status' => false, 'message' => validate_phone($_POST['new_phone'])[1]]);
		}
	}
}
elseif (isset($_POST['confirmation_code'], $_SESSION['new_phone'], $_SESSION['full_name'], $_SESSION['code'])) {
	$code = $_SESSION['code'];
	$confirmation_code = $_POST['confirmation_code'];
	$phone = $_SESSION['new_phone'];
	$name = $_SESSION['full_name'];

	if ($code == $confirmation_code) {
		//check if is already available
		$sql = $dbx->prepare("SELECT COUNT(`phone`) AS count FROM visitors WHERE phone = :phone");
		$sql->bindValue(':phone', real_phone($_SESSION['new_phone']));
		$result = $sql->execute();

		$d = $result->fetchArray();
		if ($d['count'] > 0) {
			//update
			$upd = $dbx->prepare("UPDATE visitors SET name = :name WHERE phone = :phone");
			$upd->bindValue(':name', $name);
			$upd->bindValue(':phone', $phone);
			$upd->execute();

			$sql = $dbx->prepare("SELECT * FROM visitors WHERE phone = :phone");
			$sql->bindValue(':phone', real_phone($_SESSION['new_phone']));
			$result = $sql->execute();
			$data = $result->fetchArray();
			$_SESSION['user_id'] = $data['code'];
			$_SESSION['phone'] = $data['phone'];
			$_SESSION['name'] = $data['name'];
			setcookie("user_id", $data['code'], time()+3600*24*30*12*4, "../");
			setcookie("phone", $data['phone'], time()+3600*24*30*12*4, "../");
			setcookie("name", $data['name'], time()+3600*24*30*12*4, "../");

			unset($_SESSION['code']);
			echo json_encode(['status' => true, 'song_id' => $_SESSION['song_id']]);
		}
		else{
			// insert
			$uniqid = uniqid();
			$ins = $dbx->prepare("INSERT INTO visitors (id, phone, name, code, date) VALUES (NULL, :phone, :name, :code, :date)");
			$ins->bindValue(':phone', $phone);
			$ins->bindValue(':name', $name);
			$ins->bindValue(':code', $uniqid);
			$ins->bindValue(':date', time());
			$ins->execute();
			$_SESSION['user_id'] = $uniqid;
			$_SESSION['phone'] = $phone;
			$_SESSION['name'] = $name;

			setcookie("user_id", $uniqid, time()+3600*24*30*12*4, "../");
			setcookie("phone", $phone, time()+3600*24*30*12*4, "../");
			setcookie("name", $name, time()+3600*24*30*12*4, "../");
			$name = $db->real_escape_string($name);
			$phone = real_phone($db->real_escape_string($phone));

			$code = rand(1001, 9990);
			$time = time();
			//create a new makwacha account 

			//check first
			$check_sql = $db->query("SELECT * FROM members WHERE phone = '$phone' ");
			if ($check_sql->num_rows < 1) {
				$new_account = $db->query("INSERT INTO `members`(`id`, `first`, `last`, `phone`, `password`, `uniqued`, `balance`, `registered`, `status`) VALUES (NULL, '$name', '', '$phone', '1234', '$code', '0', '$time', 'registered')");
			}
			unset($_SESSION['code']);
			echo json_encode(['status' => true, 'song_id' => $_SESSION['song_id']]);
		}
	}
	else{
		echo json_encode(['status' => false, 'message' => "Your confirmation code is not matching"]);
	}
}
else{
	echo json_encode(['status' => false, 'message' => "Your request is missing required parameters! Reload this page"]);
}
?>