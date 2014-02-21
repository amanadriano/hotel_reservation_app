<?php
	session_start();
	$txtLogin = 'Log In';
	if (isset($_SESSION['user'])) {
		$user = $_SESSION['user'];
		$txtLogin = 'Log Out';
	}
?>

<!DOCTYPE html>
<html>
<head>

	<title>Development Page for Reservation System</title>
	<link type='text/css' href='bootstrap/css/bootstrap.css' rel='stylesheet' />
	<link type='text/css' href='css/smoothness/jquery-ui-1.9.2.custom.css' rel='stylesheet' />
	<!-- Load the script "js/main.js" as our entry point -->
    <script data-main="js/main" src="js/libs/require/require.js"></script>
    
    <link type='text/css' href='js/libs/tipsy/tipsy.css' rel='stylesheet' />
    
</head>

<body>

	<div class="modal-backdrop hide" id="modalBackdrop"></div>
	<div id="modalDiv" class="modal hide" style='top: 50%; left: 50%;'>
		<div class="modal-header">
			<button type="button" class="close" id="btnModalClose">&times;</button>
			<h3 id="modalLabel"></h3>	
		 </div>
		 <div class="modal-body">
		 </div>		 
	</div>

	<div class="container" style='position: relative;'>
		<div id='greet' class='row'>
			<?php
				if (isset($_SESSION['user'])) {
					echo "<p class='alert alert-info'>Hello <strong>" . $user['username'] . "</strong>, haven't seen you since " . $user['last_log'] . 
					'. <a href="#" id="navLogout" class="pull-right"><i class="icon-check"></i> Logout</a>' .
					"</p>";
				} else {
					echo "<p class='label label-info'>Please log in first. Thank you.</p>";
				}
			?>
		</div>
		<div class='row'>
			<ul class="nav nav-tabs" id='nav-bar'>
				<li class=""><a href="#" id="navReservations"><i class='icon-heart'></i> Reservations</a></li>
				<li class=""><a href="#" id="navCheckins"><i class='icon-thumbs-up'></i> Check-Ins</a></li>
				<li class=""><a href="#" id="navGuests"><i class='icon-briefcase'></i> Guests</a></li>
				<li class=""><a href="#" id="navRooms"><i class='icon-home'></i> Rooms</a></li>
				<li class=""><a href="#" id="navReports"><i class='icon-print'></i> Reports</a></li>
				<li class=""><a href="#" id="navUsers"><i class='icon-user'></i> Users</a></li>
	<!--
				<li class=""><a href="#" id="navLogout"><i class='icon-star-empty'></i> <?php echo $txtLogin; ?></a></li>
	-->
			</ul>
		</div>
		<div class="row">		
			<div class="span12">				
				<div id="main-content" class='row'></div>
			</div>
		</div>
	</div>				


	
</body>
</html>
