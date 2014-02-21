<?php

	session_start();
	require "class.data.php";
	//get all rooms from database
	$db = new DB_Class();
	$rooms = $db->getAllRooms();
	header(' ', true, 200);
	echo json_encode($rooms);
	unset($db);

?>
