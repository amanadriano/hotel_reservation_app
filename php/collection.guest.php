<?php

	require "class.data.php";
	$request = $_SERVER['REQUEST_METHOD']; 

	if ($request == 'POST') {
		$data = json_decode(urldecode($_POST['model']));
		//echo $data->fullname;
		//create new record to database
		$db = new DB_Class();
		$ret = $db->createGuest($data);		
		//$ret = array("id"=>rand(5, 200));
		if ($ret > 0) {
			echo json_encode($ret);
		} else {
			//error occured
			echo json_encode("error");
		}
		unset($db);
		exit();
	} else if ($request == 'PUT') {		//update guest record
	} else if ($request == 'DELETE') { 	//delete record
		
	} else if ($request == 'GET') {											//get/fetch records
		$search = "";
		if (isset($_GET['search'])) $search = $_GET['search'];
		$db = new DB_Class();
		$ret = $db->getGuests($search);
		echo json_encode($ret);
		unset($db);
	}
	
?>
 
