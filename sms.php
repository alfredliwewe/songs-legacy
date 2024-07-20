<?php
function curl_post($url, array $post = NULL, array $options = array()) { 
	$defaults = array( 
		CURLOPT_POST => 1, 
		CURLOPT_HEADER => 0, 
		CURLOPT_URL => $url, 
		CURLOPT_FRESH_CONNECT => 1, 
		CURLOPT_RETURNTRANSFER => 1, 
		CURLOPT_FORBID_REUSE => 1, 
		CURLOPT_TIMEOUT => 4, 
		CURLOPT_POSTFIELDS => http_build_query($post) 
	); 

	$ch = curl_init(); 
	curl_setopt_array($ch, ($options + $defaults)); 
	if( ! $result = curl_exec($ch)) { 
		//trigger_error(curl_error($ch)); 
	} 
	curl_close($ch);
	return $result;
}

function sendMessage($phone, $message){
	//curl_post("http://sms.opengates-agency.com/sms_api/", ['username' => "phptutor", 'key' => "c4fe826af416c4163d9c91ae23435c2b", 'phone' => $phone, 'message' => $message], []);
	return curl_post("http://localhost/api/sms/sms_in.php", ['phone' => $phone, 'sandbox' => time(), 'userId' => time(), 'message' => $message], []);
}
