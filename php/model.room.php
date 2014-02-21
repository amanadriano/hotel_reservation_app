<?php
	session_start();
	if (!isset($_SESSION['user'])) {
		header(' ', true, 401);
		exit();
	}
	
	$user = $_SESSION['user'];
	require "class.data.php";

	$request = $_SERVER['REQUEST_METHOD']; 
		
	if ($request == 'POST') {			//save/create a record		
		$data = json_decode(file_get_contents("php://input"));		
		//create new record to database
		$db = new DB_Class();
		$return = $db->createRoom($data);		
		$data = array("error"=>"0", "id"=>$return['newId'], "msg"=>$return['msg']);
		if ($return['newId'] > 0) {
			header(' ', true, 200);
			echo json_encode($data);
		} else {					//error occured
			$data['error'] = '1';
			header(' test error', true, 403);
			echo json_encode($data);
		}
		unset($db);
		exit();
	} else if ($request == 'PUT') {		//update guest record
		if ($user['permission'] < 2) {
			header(' ', true, 403);
			exit();
		}
		$data = json_decode(file_get_contents("php://input"));
		//error_log($data->id);
		$db = new DB_Class();
		$db->updateRoom($data);		
		header(' ', true, 200);
		echo json_encode($data);
	} else if ($request == 'DELETE') {	//delete record
		if ($user['permission'] < 3) {
			header(' ', true, 403);
			exit();
		}
		if (!isset($_GET['id'])) {
			header(' ', true, 403);
			exit();
		}
		$id = $_GET['id'];
		$db = new DB_Class();
		$result = $db->deleteRoom($id);
		$data = array("error"=>"0", "msg"=>"");		
		if ($result) {
			header(' ', true, 200);
			echo json_encode($data);
		} else {
			header(' ', true, 403);
			$data['error'] = 1;
			$data['msg'] = 'Failed to delete record.';
			echo json_encode($data);
		}
		exit();
	} else if ($request == 'GET') {											//get/fetch records
		$id = 0;
		$db = new DB_Class();
		if (isset($_GET['id'])) {
			$id = $_GET['id'];
			$ret = $db->getRoom($id);
		} else if (isset($_GET)) {			
			$ret = $db->getAllRooms($_GET);
		} else {
			$ret = $db->getAllRooms();
		}
		header(' ', true, 200);
		echo json_encode($ret);
		unset($db);
	}
	
?>
 
