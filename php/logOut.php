<?php
	session_start();
	unset($_SESSION);	
	session_destroy();
	$rt = array('done'=>1);
	echo json_encode($rt);
?>
