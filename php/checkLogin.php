<?php
	
	unset($_SESSION);	
	require "class.data.php";
	$username = $_POST['username'];
	$password =$_POST['password'];

	//check database for authentication of user (during login)
	$db = new DB_Class();
	$user = $db->authenticate($username, $password);
	unset($db);	
	if (count($user) == 0) {		
		$status = array('error'=>array('text'=>'Username or Password failed on verification.'));
		echo json_encode($status);
	} else {
		session_start();
		$_SESSION['user'] = $user;		
		echo json_encode($user);
	}	

?>
