<?php

	require "class.data.php";

	if (array_key_exists('model', $_POST)) {			//save/create a record		
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
	} else if (array_key_exists('_method', $_POST)) {
		if ($_POST['_method'] == "PUT") {				//update script
		
		} else if ($_POST['_method'] == "DELETE") {		//delete script
		
		}		
	} else {											//get/fetch records				
		$db = new DB_Class();
		$ret = $db->getGuests();
		echo json_encode($ret);
		unset($db);
	}
	
?>
 
