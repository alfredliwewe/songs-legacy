<?php
require '../db.php';

if (isset($_GET['verify'])) {
	$ref = $db->real_escape_string($_GET['verify']);

	$db->query("UPDATE artists SET status = 'verified' WHERE ref = '$ref' ");

	echo "<h3>Successfully verified</h3>";
}
?>