<?php

session_start();
require '../../db.php';
require '../../mail.php';

if (isset($_POST['login_email'], $_POST['password'])) {
	$email = $db->real_escape_string($_POST['login_email']);
	$password = md5($_POST['password']);

	$read = $db->query("SELECT * FROM artists WHERE email = '$email' ");
	if ($read->num_rows > 0) {
		$data = $read->fetch_assoc();

		if ($data['password'] == $password) {
			$data['status'] = true;
			$_SESSION['user_id'] = $data['id'];
			$_SESSION['data'] = $data;

			echo json_encode($data);
		}
		else{
			echo json_encode(['status' => false, 'message' => "Password is incorrect", 'type' => 'password']);
		}
	}
	else{
		echo json_encode(['status' => false, 'message' => "Email is not registered", 'type' => 'email']);
	}
}
elseif (isset($_POST['register_email'], $_POST['password'], $_POST['fullname'])) {
	$email = $db->real_escape_string($_POST['register_email']);
	$password = md5($_POST['password']);
	$fullname = $db->real_escape_string($_POST['fullname']);

	$ref = Crypto::letters(32);

	$check = $db->query("SELECT * FROM artists WHERE email = '$email' ");
	if ($check->num_rows > 0) {
		echo json_encode(['status' => false, 'message' => "Email is already registered", 'type' => 'email']);
	}
	else{
		//save
		$ins = $db->query("INSERT INTO `artists`(`id`, `name`, `phone`, `email`, `country`, `picture`, `thumbnail`, `profile`, `banner`, `password`, `status`, `ref`) VALUES (NULL, '$fullname', '', '$email', '0', 'default.png', 'default.png', '0', 'default-banner.png', '$password', 'registered', '$ref')");
		$user_id = $db->insert_id;
		$data = $db->query("SELECT * FROM artists WHERE id = '$user_id' ")->fetch_assoc();

		$data['status'] = true;
		$_SESSION['user_id'] = $data['id'];
		$_SESSION['data'] = $data;

		echo json_encode($data);

		$link = $config['host']."access/?verify=".$ref;

		//sendEmail
		$html = "Dear $fullname,

		Thank you for registering as an artist on ".$config['name']."! We're excited to have you join our community of talented musicians.

		To complete the registration process and activate your artist account, please verify your email address by clicking on the following link:

		<a href=\"$link\">$link</a>

		Once you've clicked the link, you'll be all set to upload your music, connect with fans, and explore the various features our platform offers.

		If you encounter any issues during the verification process or have any questions about using our platform, don't hesitate to reach out to our support team at {$config['support-email']}.

		We can't wait to see what you create and share with the world!

		Best regards,
		Alfred Liwewe
		Managing Director
		+265992 92 11 34";
		sendEmail($email, "Verify Your Artist Registration on ".$config['name'], nl2br($html));
	}
}
else{
	echo json_encode(['status' => false, 'message' => "Not enough data", 'type' => 'email']);
}
?>