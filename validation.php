<?php

function validate_phone($phone)
{
	$result = false;

	//get length
	$length = strlen($phone);
	if ($length == 10 || $length == 13) {
		# proceed...
		if ($length == 10) {
			if ($phone[0] == "0") {
				$var = array("+", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9");
				for ($i=0; $i < strlen($phone); $i++) { 
					$targ = $phone[$i];
					if (!in_array($targ, $var)) {
						return array($result, "Unsupported character '$targ' entered in phone number");
					}
				}
			}
			else{
				return array($result, "Unsupported phone number pattern, we suggest it should start with 0");
			}
		}
		else{
			if ($phone[0] == "+") {
				$var = array("+", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9");
				for ($i=0; $i < strlen($phone); $i++) { 
					$targ = $phone[$i];
					if (!in_array($targ, $var)) {
						return array($result, "Unsupported character '$targ' entered in phone number");
					}
				}
			}
			else{
				return array($result, "Unsupported phone number pattern, we suggest it should start with 0");
			}
		}
	}
	else{
		return array($result, "Unsupported length phone number");
	}

	return array(true, "Success");
}


function validate_name($name)
{
	$name = strtolower($name);
	$allowed_characters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', "'", ' '];
	$status = true;

	for ($i=0; $i < strlen($name); $i++) { 
		if (!in_array($name[$i], $allowed_characters)) {
			return [false, 'Unsupported character "'.$name[$i].'" found in the name'];
		}
	}
	
	return [true, 'true'];
}

function real_phone($phone)
{
	$phone = str_replace(" ", "", $phone);
	if ($phone[0] == "0") {
		return "+265".substr($phone, 1);
	}
	elseif ($phone[0] == "2") {
		return "+".$phone;
	}
	else{
		return $phone;
	}
}
?>