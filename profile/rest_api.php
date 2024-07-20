<?php
session_start();
$dbx = new sqlite3("../dt/src/main.db");
require '../functions.php';
require '../makwacha/db.php';

if (isset($_SESSION['user_id'], $_SESSION['name'], $_SESSION['email'])) {
	$user_id = $_SESSION['user_id'];
    $name = $_SESSION['name'];
    $email = $_SESSION['email'];

    //read from the database file
    $res = $dbx->prepare("SELECT * FROM users WHERE id = :id");
    $res->bindValue(':id', $user_id);
    $result = $res->execute();
    $row = $result->fetchArray();
    $user_status = $row['status'];
    $phone = $row['phone'];

    if (isset($_GET['confirm_upload'])) {
    	$sql = $db->query("SELECT * FROM members WHERE phone = '$phone' ");
		if ($sql->num_rows > 0) {
			$data = $sql->fetch_assoc();
			$balance =  $data['balance'];
		}
		else{
			$balance = 0;
		}

		if ($balance >= 2000) {
			$_SESSION['code'] = $code = rand(100001, 998989);
			$message = "(rodzMusic) Your music upload confirmation code is ".$code.". Please verify soon";
			sendMessage($phone, $message);
			?>
			<p id="code_error">Enter the confirmation code</p>
			<form id="confirm_code_1" style="display: block;">
                <p><input type="text" name="confirmation_code" class="form-control border" placeholder="Confirmation code" minlength="6" maxlength="6" required></p>
                <p><input type="submit" name="submit" class="btn bg" value="Confirm"></p>
            </form>
			<?php
		}
		else{
			?>
			<div class="w3-conatiner">
				<div class="alert alert-danger">
					Your balance is not meeting up for the transaction
				</div>
			</div>
			<?php
		}
    }
    elseif (isset($_POST['confirmation_code'], $_SESSION['code'])) {
    	$code = $_SESSION['code'];
    	$confirmation_code = $_POST['confirmation_code'];

    	if ($code == $confirmation_code) {
    		$sql = $db->query("SELECT * FROM members WHERE phone = '$phone' ");
			if ($sql->num_rows > 0) {
				$data = $sql->fetch_assoc();
				$balance =  $data['balance'];
			}
			else{
				$balance = 0;
			}

			if ($balance >= 2000) {
				$code = $_SESSION['code'];

				$time = time();

				$ins = $dbx->prepare("INSERT INTO upload_pays (id, phone, code, time, status) VALUES (NULL, :phone, :code, :time, :status)");
				$ins->bindValue(':phone', $phone);
				$ins->bindValue(':code', $code);
				$ins->bindValue(':time', $time);
				$ins->bindValue(':status', 'notyet');
				$ins->execute();
				$db->query("UPDATE members SET balance = balance - 2000 WHERE phone = '$phone' ");
				unset($_SESSION['code']);
				echo json_encode(['status' => true, 'message' => 'Successfully confirmed payment']);

			}
    	}
    	else{
    		echo json_encode(['status' => false, 'message' => 'Your confirmation code is incorrect']);
    	}
    }
}
?>