<?php

	session_start();
	require "class.data.php";
	$checkinDate = $_GET['checkinDate'];
	$checkoutDate = $_GET['checkoutDate'];

	//query to database for any vacancy on these selected in & out dates
	$db = new DB_Class();
	$rooms = $db->getAvailableRooms($checkinDate, $checkoutDate);
	header(' ', true, 200);
	echo json_encode($rooms);
	unset($db);

?>
