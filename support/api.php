<?php
session_start();

$db = new sqlite3("data.db");
$db->exec("CREATE TABLE IF NOT EXISTS conversations (id INTEGER PRIMARY KEY AUTOINCREMENT, sender TEXT, receiver TEXT, content TEXT, sent_time TEXT, status TEXT)");
require '../validation.php';
if (isset($_COOKIE['phone'])) {
	$phone = real_phone($db->escapeString($_COOKIE['phone']));

	if (isset($_POST['start'])) {
		//read first
		$read = $db->query("SELECT COUNT(`sender`) AS coun_all FROM conversations WHERE sender = '$phone' OR receiver = '$phone' ");
		$d = $read->fetchArray();
		if ($d['coun_all'] < 1) {
			$greeting = "Welcome to Rodzmusic Customer Support.<br>What do you want us to help?";
			$time = time();
			$ins = $db->prepare("INSERT INTO conversations VALUES (NULL, 'bot', :user, :content, '$time', 'delivered')");
			$ins->bindValue(':content', $greeting);
			$ins->bindValue(':user', $phone);
			$ins->execute();

			echo "<div class='w3-row'><div class='w3-col s9 w3-padding-small'><div class='alert-success w3-padding w3-round-large'>$greeting</div></div></div>";
		}
		else{
			//read the available messages
			$all = $d['coun_all'];

			$start = $all - 10;
			if ($start < 0) {
				$start = 0;
			}

			$messages = $db->query("SELECT * FROM conversations WHERE sender = '$phone' OR receiver = '$phone' ");
			while ($row = $messages->fetchArray()) {
				if ($row['sender'] == "bot") {
					echo "<div class='w3-row'><div class='w3-col s9 w3-padding-small'><div class='alert-success w3-padding w3-round-large'>{$row['content']}</div></div></div>";
				}
				else{
					echo "<div class='w3-row'><div class='w3-col s3'>&nbsp;</div><div class='w3-col s9 w3-padding-small'><div class='alert-secondary w3-padding w3-round-large'>{$row['content']}</div></div></div>";
				}
			}
		}
	}
	elseif (isset($_POST['message'])) {
		$message = $db->escapeString($_POST['message']);

		$time = time();
		$ins = $db->prepare("INSERT INTO conversations VALUES (NULL, :user, 'bot', :content, '$time', 'delivered')");
		$ins->bindValue(':content', $message);
		$ins->bindValue(':user', $phone);
		$ins->execute();
	}
	else{
		echo "No required form parameters received";
	}
}
else{
	echo "No required form parameters received";
}