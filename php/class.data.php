<?php

class DB_Class {

	private $db_host = "localhost";
	private $db_user = "root";
	private $db_pwd = "test";
	private $db_name = "res";
	
	public function strToDb($strVal) {
		return htmlentities(htmlspecialchars(strip_tags($strVal)), ENT_QUOTES);
	}
	
	public function strToHTML($strVal) {
		return htmlspecialchars_decode(html_entity_decode($strVal));
	}

	public function toMysqlDateTime($date) {		
		return date("Y-m-d H:i:s", strtotime($date));
	}

	public function toRegDate($date, $format = 'm/d/Y H:i') { //  e.g. 1/1/2012 16:45
		return date($format, strtotime($date));
	}
	
	private function lockTable($con, $tablename) {
		$con->query("LOCK TABLES $tablename WRITE");
	}
	
	private function unlockTable($con) {
		$con->query("UNLOCK TABLES");
	}

	private function getLastId($con) {
		$id = 0;
		$res = $con->query("SELECT last_insert_id();");
		if ($row = $res->fetch_array()) {
			$id = $row[0];		//last insert id
		}
		$res->close();
		return $id;
	}
	
	public function createRoom($data) {
		$con = new mysqli($this->db_host, $this->db_user, $this->db_pwd, $this->db_name);
		$res = $con->prepare("INSERT INTO rooms (roomNo, roomType, description, price) VALUES (?, ?, ?, ?)");
		$description = $this->strToDb($data->description);
		$res->bind_param("issi", $data->roomNo, $data->roomType, $description, $data->price);
		$res->execute();
		$res->close();		
		//error_log($con->error);
		$lastId = $this->getLastId($con);
		$result = array('newId'=>$lastId, 'msg'=>$con->error);
		$con->close();
		return $result;
	}
	
	public function updateRoom($data) {
		$con = new mysqli($this->db_host, $this->db_user, $this->db_pwd, $this->db_name);		
		$this->lockTable($con, 'rooms');
		$res = $con->prepare("UPDATE rooms set roomNo=?, roomType=?, description=?, price=? WHERE id = ?");
		$description = $this->strToDb($data->description);
		$res->bind_param("issii", $data->roomNo, $data->roomType, $description, $data->price, $data->id);
		$result = $res->execute();
		$res->close();
		$this->unlockTable($con);
		$con->close();
		return $result;
	}
	
	public function deleteRoom($id) {
		$con = new mysqli($this->db_host, $this->db_user, $this->db_pwd, $this->db_name);
		$this->lockTable($con, 'rooms');
		$res = $con->prepare("DELETE FROM rooms WHERE id = ?");
		$res->bind_param("i", $id);		
		$result = $res->execute();
		$res->close();		
		$this->unlockTable($con);
		$con->close();
		return $result;
	}
	
	public function getRoom($id) {
	}
	
	public function getAllRooms($filter='') {
		$con = new mysqli($this->db_host, $this->db_user, $this->db_pwd, $this->db_name);
		$res = $con->query("SELECT id, roomNo, roomType, description, price FROM rooms ORDER BY ABS(roomNo) ASC");
		
		$rooms = array();
		while ($row = $res->fetch_assoc()) {
			$rooms[] = $row;
		}
		$res->close();
		$con->close();
		return $rooms;
	}


	//boiler plate
	public function save_record($table, $fields, $values) {
		$con = new mysqli($this->db_host, $this->db_user, $this->db_pwd, $this->db_name);
		$res = $con->prepare();
		$res->close();
		$con->close();
	}
	//~ -============
	
	public function createGuest($data) {
		$con = new mysqli($this->db_host, $this->db_user, $this->db_pwd, $this->db_name);
		$res = $con->prepare("INSERT INTO guests (fullname, citizenship, dob, contact_no, email, company, position)
			VALUES (?, ?, ?, ?, ?, ?, ?)");
		$dfullname = $this->strToDb($data->fullname);
		$dcitizenship = $this->strToDb($data->citizenship);
		$ddob = $this->toMysqlDateTime($data->dob);
		$dcompany = $this->strToDb($data->company);
		$dposition = $this->strToDb($data->position);
		$res->bind_param("sssssss", $dfullname, $dcitizenship, $ddob, 
						$data->contact_no, $data->email, $dcompany, $dposition);
		$res->execute();
		$res->close();		
		$lastId = $this->getLastId($con);
		$con->close();
		return $lastId;
	}

	public function updateGuest($data) {
		$con = new mysqli($this->db_host, $this->db_user, $this->db_pwd, $this->db_name);
		$this->lockTable($con, 'guests');
		$res = $con->prepare("UPDATE guests SET fullname = ?, citizenship = ?, dob = ?, contact_no = ?, email = ?, company = ?, position = ? WHERE id = ?");
		$dfullname = $this->strToDb($data->fullname);
		$dcitizenship = $this->strToDb($data->citizenship);
		$ddob = $this->toMysqlDateTime($data->dob);
		$dcompany = $this->strToDb($data->company);
		$dposition = $this->strToDb($data->position);
		$res->bind_param("sssssssi", $dfullname, $dcitizenship, $ddob, 
						$data->contact_no, $data->email, $dcompany, $dposition, $data->id);		
		$res->execute();
		$res->close();		
		$this->unlockTable($con);
		$con->close();		
	}

	public function getGuests($search="") {
		$con = new mysqli($this->db_host, $this->db_user, $this->db_pwd, $this->db_name);
		$where = " WHERE fullname like '%$search%' ";
		$res = $con->query("SELECT * FROM guests $where ORDER BY fullname");
		$data = array();
		while ($row = $res->fetch_assoc()) {
			$row['dob'] = $this->toRegDate($row['dob'], 'm/d/Y');
			$data[] = $row;
		}
		$res->close();
		$con->close();
		return $data;
	}

	public function getGuest($id=0) {
		$con = new mysqli($this->db_host, $this->db_user, $this->db_pwd, $this->db_name);
		$where = " WHERE id = $id ";		
		$res = $con->query("SELECT * FROM guests $where ORDER BY fullname");
		$data = array();
		while ($row = $res->fetch_assoc()) {
			$data = $row;
		}
		$data['dob'] = $this->toRegDate($data['dob'], 'm/d/Y');
		$res->close();
		$con->close();
		return $data;
	}

	public function deleteGuest($id) {
		$con = new mysqli($this->db_host, $this->db_user, $this->db_pwd, $this->db_name);
		$this->lockTable($con, 'guests');
		$res = $con->prepare("DELETE FROM guests WHERE id = ?");
		$res->bind_param("i", $id);		
		$result = $res->execute();
		$res->close();		
		$this->unlockTable($con);
		$con->close();
		return $result;
	}

	public function getAvailableRooms($checkinDate, $checkoutDate) {
		//get all rooms
		$rooms = array();
		$con = new mysqli($this->db_host, $this->db_user, $this->db_pwd, $this->db_name);
		$res = $con->query("SELECT * FROM rooms ORDER BY id");		
		while ($row = $res->fetch_assoc()) {
			$rooms[] = $row;
		}
		$res->close();		

		//get used rooms within the given period
		$roomsUsed = array();
		$inDate = $this->toMysqlDateTime($checkinDate);
		$outDate = $this->toMysqlDateTime($checkoutDate);
		$res = $con->query("
			SELECT roomId FROM checkins
			WHERE
				-- status = 'ACTIVE' AND
				(
					checkin BETWEEN '$inDate' AND '$outDate'
					OR checkout BETWEEN '$inDate' AND '$outDate'
					OR '$inDate' BETWEEN checkin AND checkout
					OR '$outDate' BETWEEN checkin AND checkout
				)
			ORDER BY roomId DESC				
		");
		
		while ($row = $res->fetch_assoc()) {
			$roomsUsed[] = $row['roomId'];
		}
		$res->close();

		//get reserved rooms
		//~ $roomsReserved = array();
		//~ $res = $con->query("
			//~ -- SELECT roomType, COUNT(*) as Total FROM reservations
			//~ SELECT roomId FROM reservations
			//~ WHERE
				//~ -- status = 'ACTIVE' AND
				//~ (
					//~ checkIn BETWEEN '$inDate' AND '$outDate'
					//~ OR checkOut BETWEEN '$inDate' AND '$outDate'
					//~ OR '$inDate' BETWEEN checkIn AND checkOut
					//~ OR '$outDate' BETWEEN checkIn AND checkOut
				//~ )
			//~ ORDER BY roomId DESC
		//~ ");						
		//~ while ($row = $res->fetch_assoc()) {
			//~ $roomsReserved[] = $row['roomId'];
		//~ }
		//~ $res->close();		
		
		$roomsAvailable = array();
		//error_log($roomsUsed[0] . " -- " . $roomsReserved[0]);
		//error_log(count($rooms));
		//get all vacant rooms
		//~ if (count($roomsUsed) > 0 || count($roomsReserved) > 0) {
		if (count($roomsUsed) > 0) {
			//for ($i=0;$i<count($rooms);$i++) {						
			while (count($rooms) > 0) {
				//if $tmpRoom doesn't contain any room, exit this loop (no room is in used)
				//$room = $rooms[$i];		
				$room = array_pop($rooms);
				//error_log($i . ' = ' .$room['id']);	
				//~ if (!in_array($room['id'], $roomsUsed) && !in_array($room['id'], $roomsReserved)) {	//or rooms id matches a reserved room's id for the given period
				if (!in_array($room['id'], $roomsUsed)) {	//or rooms id matches a reserved room's id for the given period
					$roomsAvailable[] = $room;
				}										
			}
		} else {
			$roomsAvailable = $rooms;
		}

		//print_r($roomsUsed);
		//$roomsAvailable = array_values($roomsAvailable);				//re index array		
		$con->close();
		return $roomsAvailable;
								
	}
		
	//checkin records ==================================================
	public function createCheckin($data) {
		$con = new mysqli($this->db_host, $this->db_user, $this->db_pwd, $this->db_name);
		$this->lockTable($con, 'checkins');
		$res = $con->prepare("INSERT INTO checkins (guestId, checkin, checkout, roomId, status, roomPrice, pax, children)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
		$dcheckin = $this->toMysqlDateTime($data->checkIn);
		$dcheckout = $this->toMysqlDateTime($data->checkOut);
		$res->bind_param("issisiii", $data->guestId, $dcheckin, $dcheckout, 
						$data->roomId, $data->status, $data->roomPrice, $data->pax, $data->children);
		$res->execute();
		$res->close();		
		$this->unlockTable($con);
		$lastId = $this->getLastId($con);
		
		if (isset($data->charge)) {
			$charge = $data->charge;
			$reservationId = $data->reservationId;
			
			//create charge entry
			$res = $con->prepare("INSERT INTO charges (description, amount, qty, qty_cost, name, action, checkinId, date)
								VALUES ('Room Charge', ?, 1, ?, 'Room Charge', 1, ?, ?)");
			$dcheckin = $this->toMysqlDateTime($data->checkIn);
			$res->bind_param('iiis', $data->roomPrice, $data->roomPrice, $lastId, $dcheckin);
			$res->execute();
			$res->close();
			//create payment entry from deposit amount
			if ($charge->qty_cost > 0) {
				$res = $con->prepare("INSERT INTO charges (description, amount, qty, qty_cost, name, action, checkinId, date)
									VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
				$ddate = $this->toMysqlDateTime($charge->date);
				$res->bind_param('siiisiis', $charge->description, $charge->amount, $charge->qty, $charge->qty_cost, $charge->name, $charge->action, $lastId, $ddate);
				$res->execute();
				$res->close();	
			}
			//delete reservation record
			$this->lockTable($con, 'reservations');
			$con->query("DELETE FROM reservations WHERE id = $reservationId");
			$this->unlockTable($con);
		} else {
			$res = $con->prepare("INSERT INTO charges (description, amount, qty, qty_cost, name, action, checkinId, date)
								VALUES ('Room Charge', ?, 1, ?, 'Room Charge', 1, ?, ?)");
			$dcheckin = $this->toMysqlDateTime($data->checkIn);
			$res->bind_param('iiis', $data->roomPrice, $data->roomPrice, $lastId, $dcheckin);
			$res->execute();
			$res->close();
		}
		
		$con->close();
		return $lastId;
	}

	public function updateCheckin($data) {
		$con = new mysqli($this->db_host, $this->db_user, $this->db_pwd, $this->db_name);
		$this->lockTable($con, 'checkins');
		$res = $con->prepare("UPDATE checkins SET guestId=?, checkin=?, checkout=?, roomId=?, status=?, roomPrice=?, pax=?, children=? WHERE id=?");
		$dcheckin = $this->toMysqlDateTime($data->checkIn);
		$dcheckout = $this->toMysqlDateTime($data->checkOut);
		$res->bind_param("issisiiii", $data->guestId, $dcheckin, $dcheckout, 
						$data->roomId, $data->status, $data->roomPrice, $data->pax, $data->children, $data->id);
		$res->execute();
		$res->close();		
		$this->unlockTable($con);
		$con->close();		
	}
	
	public function getCheckins($arg) {
		$con = new mysqli($this->db_host, $this->db_user, $this->db_pwd, $this->db_name);
		$filter = "";
		
		if (!isset($arg)) {
			$where = "";		
			$res = $con->query("SELECT x.id, guestId, checkIn, checkOut, roomId, status, roomPrice, y.fullname, z.roomNo, pax, children
							FROM checkins AS x, guests AS y, rooms AS z
							WHERE y.id = guestId AND z.id = roomId $filter");
		} else if (isset($arg['report'])) {		//called from the report page
			$status = '';
			$dateFilter = '';
			if (isset($arg['status'])) $status = " AND status = '" . $arg['status'] . "' ";
			if (isset($arg['nodates'])) {
				$dateFilter = '';
			} else {
				$from = $this->toMysqlDateTime($arg['cinFrom']);
				$to = $this->toMysqlDateTime($arg['cinTo']);
				$dateFilter = " AND DATE(checkIn) BETWEEN '$from' AND '$to' ";
			}
			$res = $con->query("SELECT x.id, guestId, checkIn, checkOut, roomId, status, roomPrice, y.fullname, z.roomNo, pax, children
							FROM checkins AS x, guests AS y, rooms AS z
							WHERE y.id = guestId AND z.id = roomId
							$dateFilter
							$status
							ORDER BY checkIn
							");
		} else {
			$where = array();
			if (isset($arg['status'])) {
				$where[] = " x.status = '" . $arg['status'] . "' ";
			}
			
			if (isset($arg['cinFrom'])) {
				$from = $this->toMysqlDateTime($arg['cinFrom']);
				$to = $this->toMysqlDateTime($arg['cinTo']);
				$where[] = " checkIn BETWEEN '$from' AND '$to' ";
			}
			
			if (isset($arg['cinName'])) {
				$cinName = $arg['cinName'];
				$where[] = " y.fullname LIKE '%$cinName%' ";
			}
			
			$filter = implode(" AND ", $where);
			$filter = " AND " . $filter;		
			
			if (!isset($arg['FOR_BLOCKINGS'])) {
				$res = $con->query("SELECT x.id, guestId, checkIn, checkOut, roomId, status, roomPrice, y.fullname, z.roomNo, pax, children
							FROM checkins AS x, guests AS y, rooms AS z
							WHERE y.id = guestId AND z.id = roomId $filter");
			} else {
				$res = $con->query("SELECT x.id, guestId, checkIn, checkOut, roomId, status, roomPrice, y.fullname, z.roomNo, pax, children
							FROM checkins AS x, guests AS y, rooms AS z
							WHERE y.id = guestId AND z.id = roomId 
							AND (
							checkIn BETWEEN '$from' AND '$to' OR
							checkOut BETWEEN '$from' AND '$to' OR
							'$from' BETWEEN checkIn AND checkOut OR
							'$to' BETWEEN checkIn AND checkOut
							)
						");
			}
		}
				
		
		$data = array();
		while ($row = $res->fetch_assoc()) {
			$row['checkIn'] = $this->toRegDate($row['checkIn']);
			$row['checkOut'] = $this->toRegDate($row['checkOut']);
			$data[] = $row;
		}
		$res->close();
		$con->close();
		return $data;
	}

	public function getCheckin($id=0) {
		$con = new mysqli($this->db_host, $this->db_user, $this->db_pwd, $this->db_name);
		$res = $con->query("SELECT guestId, checkIn, checkOut, roomId, status, roomPrice, y.fullname, z.roomNo, pax, children
							FROM checkins AS x, guests AS y, rooms AS z
							WHERE y.id = guestId AND z.id = roomId AND id = $id");
		$data = array();
		while ($row = $res->fetch_assoc()) {
			$data = $row;
		}
		$data['checkIn'] = $this->toRegDate($data['checkIn']);
		$data['checkOut'] = $this->toRegDate($data['checkOut']);
		$res->close();
		$con->close();
		return $data;
	}

	public function deleteCheckin($id=0) {
		$con = new mysqli($this->db_host, $this->db_user, $this->db_pwd, $this->db_name);
		$this->lockTable($con, 'checkins');
		$res = $con->prepare("DELETE FROM checkins WHERE id = ?");
		$res->bind_param("i", $id);		
		$result = $res->execute();
		$res->close();
		$this->unlockTable($con);		
		$con->close();		
		return $result;
	}

	//gets all charge of checkinid========================
	//~ public function getCharges($checkinId=0) {
		//~ $con = new mysqli($this->db_host, $this->db_user, $this->db_pwd, $this->db_name);
		//~ $res = $con->query("SELECT description, amount, qty, qty_cost, name, action, checkinId, date FROM charges WHERE checkinId = $checkinId ORDER BY date ASC");
		//~ $charges = array();
		//~ while ($row = $res->fetch_assoc()) {
			//~ $charges[] = $row;
		//~ }		
		//~ $res->close();
		//~ $con->close();
		//~ 
		//~ $recurr = array();
		//~ $data = array();	//main data holder;
		//~ 
		//~ //process charges
		//~ $interval = new DateInterval("P1D");							//create interval object for "Days"
		//~ foreach ($charges AS $i => $charge) {							//loop over all charges
																		//~ //get current item
			//~ if (count($recurr) > 0) {									//check if recurring list has data <RL>
				//~ $initdate = date_create($recurr[0]['date']);
				//~ $lastdate = date_create($charge['date']);
				//~ $diff = date_diff($initdate, $lastdate);
							//~ 
				//~ if ($diff->invert != 1 && $diff->days > 0) { 										//yes : 	check date of recursion. if <RL> date < current date, "print all recursion data from recurring 
					//~ 
					//~ while (date_diff($initdate, $lastdate)->days > 0) {
						//~ for ($a=0;$a<count($recurr);$a++) {
							//~ $recurr[$a]['date'] = $initdate->format('m/d/Y');
							//~ $data[] = $recurr[$a];						//printing recurring charges for each day until the current date is reached (lastdate)
						//~ }	
						//~ date_add($initdate, $interval);					//start date up to the day before the current date". 
					//~ }													//and change all dates of recurring charges to current date, 
					//~ for ($a=0;$a<count($recurr);$a++) {
						//~ $recurr[$a]['date'] = $lastdate->format('m/d/Y');
					//~ }
				//~ }
				//~ 
			//~ }
		//~ 
			//~ if ($charge['action'] != 0) {			//check if current item is recurring charge or return. 
		//~ //		yes	:	add to recurring items, (date adding new recurring item, check for same item on the list and add/deduct to total charge and qty) 
		//~ //				possible for rented/returned items/charges e.g. pillow, bed, fan, etc...
				//~ if ($charge['action'] == 1) { 		//1 = recurring charge
					//~ //add to list only
					//~ $update = false;
					//~ for ($a=0;$a<count($recurr);$a++) {
						//~ if ($charge['name'] == $recurr[$a]['name']) {
							//~ $recurr[$a]['qty'] += $charge['qty'];
							//~ $recurr[$a]['amount'] += $charge['amount'];
							//~ $update = true;
							//~ break;
						//~ }
					//~ }
					//~ if (!$update) $recurr[] = $charge;
				//~ } else {							//2 = returned item
					//~ //update same record to recurring charge
					//~ for ($a=0;$a<count($recurr);$a++) {
						//~ if ($charge['name'] == $recurr[$a]['name']) {
							//~ $recurr[$a]['qty'] -= $charge['qty'];
							//~ $recurr[$a]['amount'] -= $charge['amount'];
							//~ if ($recurr[$a]['qty'] == 0) unset($recurr[$a]);
							//~ break;
						//~ }
					//~ }
					//~ $data[] = $charge;
				//~ }
			//~ } else {								//		no	: 	print charge
				//~ $data[] = $charge;
			//~ }
		//~ 
		//~ }
		//~ 
			//~ //print out remaining info from list of recurring charges
			//~ if (count($recurr) > 0) {									//check if recurring list has data <RL>
				//~ $initdate = date_create($recurr[0]['date']);
				//~ $lastdate = date_create();
				//~ $diff = date_diff($initdate, $lastdate);
				//~ 
				//~ if ($diff->invert != 1 && $diff->days > 0) { 										//yes : 	check date of recursion. if <RL> date < current date, "print all recursion data from recurring 
					//~ 
					//~ while (date_diff($initdate, $lastdate)->days > 0) {
						//~ for ($a=0;$a<count($recurr);$a++) {
							//~ $recurr[$a]['date'] = $initdate->format('M-d-Y');
							//~ $data[] = $recurr[$a];						//printing recurring charges for each day until the current date is reached (lastdate)
						//~ }	
						//~ date_add($initdate, $interval);					//start date up to the day before the current date". 
					//~ }					
				//~ }
				//~ 
			//~ }
		//~ 
		//~ //print_r($recurr);
		//~ 
		//~ return $data;
	//~ }


	//CHARGES METHODS ==================================================
	public function createCharge($data) {
		$con = new mysqli($this->db_host, $this->db_user, $this->db_pwd, $this->db_name);
		
		$res = $con->prepare("INSERT INTO charges (description, amount, qty, qty_cost, name, action, checkinId, date)
								VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
		$ddescription = $this->strToDb($data->description);
		$ddate = $this->toMysqlDateTime($data->date);
		$res->bind_param('siiisiis', $ddescription, 
										$data->amount, 
										$data->qty, 
										$data->qty_cost, 
										$data->name, 
										$data->action, 
										$data->checkinId, 
										$ddate
						);
		$res->execute();
		$res->close();
		$lastId = $this->getLastId($con);		
		$con->close();
		return $lastId;
	}

	public function updateCharge($data) {
		//error_log("log it " . $data->qty_cost);
		$con = new mysqli($this->db_host, $this->db_user, $this->db_pwd, $this->db_name);
		$this->lockTable($con, 'charges');
		$res = $con->prepare("UPDATE charges SET description=?, amount=?, qty=?, qty_cost=?, name=?, date=? WHERE id=?");
		$ddate = $this->toMysqlDateTime($data->date);
		$res->bind_param("siiissi", $data->description, $data->amount, 
									$data->qty, $data->qty_cost, $data->name,
									$ddate, $data->id);
		$res->execute();
		$res->close();		
		$this->unlockTable($con);
		$con->close();		
	}

	public function getCharges($arg) {		
		$con = new mysqli($this->db_host, $this->db_user, $this->db_pwd, $this->db_name);		
		if (is_array($arg)) {
			$from = $this->toMysqlDateTime($arg['cinFrom']);
			$to = $this->toMysqlDateTime($arg['cinTo']);
			$res = $con->query("SELECT charges.id, description, amount, qty, qty_cost, name, action, checkinId, date, fullname 
								FROM 
									charges, checkins, guests
								WHERE
									charges.checkinid = checkins.id AND	guests.id = checkins.guestid AND
									DATE(charges.date) BETWEEN '$from' AND '$to' AND action = 3
								ORDER BY date ASC");
			$charges = array();
			while ($row = $res->fetch_assoc()) {
				$row['date'] = $this->toRegDate($row['date']);
				$charges[] = $row;				
			}		
			$res->close();			
			$con->close();								
		} else {	//query was called by checkin form, gets charges for a specific guest						
			error_log("2nd");
			$checkinId = $arg;
			$res = $con->query("SELECT id, description, amount, qty, qty_cost, name, action, checkinId, date FROM charges WHERE checkinId = $checkinId ORDER BY date ASC");
			$charges = array();
			while ($row = $res->fetch_assoc()) {
				$row['date'] = $this->toRegDate($row['date']);
				$charges[] = $row;
			}		
			$res->close();
			$con->close();					
		}
		
		return $charges;
	}
	
	
	
	public function deleteCharge($id) {
		$con = new mysqli($this->db_host, $this->db_user, $this->db_pwd, $this->db_name);
		$this->lockTable($con, 'charges');
		$res = $con->prepare("DELETE FROM charges WHERE id = ?");
		$res->bind_param("i", $id);		
		$result = $res->execute();
		$res->close();		
		$this->unlockTable($con);
		$con->close();
		return $result;
	}
	
	
	
	//RESERVATION FUNCTIONS ===========================================================
	public function createReservation($data) {
		$con = new mysqli($this->db_host, $this->db_user, $this->db_pwd, $this->db_name);
		$res = $con->prepare("INSERT INTO reservations (guestId, checkIn, checkOut, roomId, status, pax, children, deposit, roomPrice, depositDate)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
		$dcheckin = $this->toMysqlDateTime($data->checkIn);
		$dcheckout = $this->toMysqlDateTime($data->checkOut);
		$ddepositdate = $this->toMysqlDateTime($data->depositDate);
		$res->bind_param("issisiiiis", $data->guestId, $dcheckin, $dcheckout, 
						$data->roomId, $data->status, $data->pax, $data->children, $data->deposit, $data->roomPrice, $ddepositdate);
		$res->execute();
		$res->close();		
		$lastId = $this->getLastId($con);
		
		$con->close();
		return $lastId;
	}
	
	public function updateReservation($data) {
		$con = new mysqli($this->db_host, $this->db_user, $this->db_pwd, $this->db_name);
		$this->lockTable($con, 'reservations');
		$res = $con->prepare("UPDATE reservations SET guestId=?, checkin=?, checkout=?, roomId=?, status=?, roomPrice=?, pax=?, children=?, deposit=?, depositDate=? WHERE id=?");
		$dcheckin = $this->toMysqlDateTime($data->checkIn);
		$dcheckout = $this->toMysqlDateTime($data->checkOut);
		$ddepositdate = $this->toMysqlDateTime($data->depositDate);
		$res->bind_param("issisiiiisi", $data->guestId, $dcheckin, $dcheckout, 						
						$data->roomId, $data->status, $data->roomPrice, $data->pax, $data->children, $data->deposit, $ddepositdate, $data->id);
		$res->execute();
		$res->close();		
		$this->unlockTable($con);
		$con->close();		
	}
	
	
	public function deleteReservation($id) {
		$con = new mysqli($this->db_host, $this->db_user, $this->db_pwd, $this->db_name);
		$this->lockTable($con, 'reservations');
		$res = $con->prepare("DELETE FROM reservations WHERE id = ?");
		$res->bind_param("i", $id);		
		$result = $res->execute();
		$res->close();		
		$this->unlockTable($con);
		$con->close();
		return $result;
	}

	public function getReservation($id=0) {
		$con = new mysqli($this->db_host, $this->db_user, $this->db_pwd, $this->db_name);
		$res = $con->query("SELECT guestId, checkIn, checkOut, roomId, status, roomPrice, y.fullname, z.roomNo, pax, children, roomPrice, depositDate
							FROM reservations AS x, guests AS y, rooms AS z
							WHERE y.id = guestId AND z.id = roomId AND id = $id");
		$data = array();
		while ($row = $res->fetch_assoc()) {
			$data = $row;
		}
		$data['checkIn'] = $this->toRegDate($data['checkIn']);
		$data['checkOut'] = $this->toRegDate($data['checkOut']);
		$data['depositDate'] = $this->toRegDate($data['depositDate']);
		$res->close();
		$con->close();
		return $data;
	}
	
	public function getReservations($arg) {
		$con = new mysqli($this->db_host, $this->db_user, $this->db_pwd, $this->db_name);
		$filter = "";
		
		if (!isset($arg) || count($arg) == 0) {
			$where = "";		
		} else if (isset($arg['report'])) {			
			$from = $this->toMysqlDateTime($arg['cinFrom']);
			$to = $this->toMysqlDateTime($arg['cinTo']);
			$filter = " AND DATE(checkIn) BETWEEN '$from' AND '$to'";			
		} else {
			//~ $where = array();
			//~ if (isset($arg['status'])) {
				//~ $where[] = " x.status = '" . $arg['status'] . "' ";
			//~ }
			
			if (isset($arg['cinFrom'])) {
				$from = $this->toMysqlDateTime($arg['cinFrom']);
				$to = $this->toMysqlDateTime($arg['cinTo']);
				$where[] = " (checkIn BETWEEN '$from' AND '$to' OR checkOut BETWEEN '$from' AND '$to' OR " . 
				" '$from' BETWEEN checkIn and checkOut OR '$to' BETWEEN checkIn AND checkOut) ";
			}
			
			//~ if (isset($arg['cinName'])) {
				//~ $cinName = $arg['cinName'];
				//~ $where[] = " y.fullname LIKE '%$cinName%' ";
			//~ }
			
			$filter = implode(" AND ", $where);
			$filter = " AND " . $filter;		
			//error_log($filter);
		}
		
		$res = $con->query("SELECT x.id, guestId, checkIn, checkOut, roomId, status, deposit, y.fullname, z.roomNo, pax, children, roomPrice, depositDate
							FROM reservations AS x, guests AS y, rooms AS z
							WHERE y.id = guestId AND z.id = roomId $filter");
		$data = array();
		while ($row = $res->fetch_assoc()) {
			$row['checkIn'] = $this->toRegDate($row['checkIn']);
			$row['checkOut'] = $this->toRegDate($row['checkOut']);
			$row['depositDate'] = $this->toRegDate($row['depositDate']);
			$data[] = $row;
		}
		//print_r($data);
		$res->close();
		$con->close();
		return $data;
	}

	public function createUser($data) {
		$con = new mysqli($this->db_host, $this->db_user, $this->db_pwd, $this->db_name);
		$res = $con->prepare("INSERT INTO users (username, password, permission, last_log, date_created) VALUES (?, SHA1(?), ?, '', NOW())");
		$duser = $this->strToDb($data->username);
		$dpass = $this->strToDb($data->password);
		$res->bind_param("ssi", $duser, $dpass, $data->permission);
		$res->execute();
		$res->close();		
		$lastId = $this->getLastId($con);
		$con->close();
		return $lastId;
	}

	public function updateUser($data) {
		$con = new mysqli($this->db_host, $this->db_user, $this->db_pwd, $this->db_name);
		$this->lockTable($con, 'users');
		$res = $con->prepare("UPDATE users set username=?, password=SHA1(?), permission=? WHERE id = ?");
		$duser = $this->strToDb($data->username);
		$dpass = $this->strToDb($data->password);
		$res->bind_param("ssii", $duser, $dpass, $data->permission, $data->id);
		$result = $res->execute();
		$res->close();				
		$this->unlockTable($con);
		$con->close();		
		return $result;
	}

	public function deleteUser($data) {
		$con = new mysqli($this->db_host, $this->db_user, $this->db_pwd, $this->db_name);
		$this->lockTable($con, 'users');
		$res = $con->prepare("DELETE FROM users WHERE id = ?");
		$res->bind_param("i", $data);
		$result = $res->execute();
		$res->close();			
		$this->unlockTable($con);	
		$con->close();		
		return $result;
	}
	
	public function getUser($data) {
		$con = new mysqli($this->db_host, $this->db_user, $this->db_pwd, $this->db_name);
		$res = $con->query("SELECT id, username, password, permission, last_log, date_created FROM users WHERE id = $data");				
		$record = array();
		while ($row = $res->fetch_assoc()) {
			$row['last_log'] = $this->toRegDate($row['last_log']);
			$row['date_created'] = $this->toRegDate($row['date_created']);
			$record = $row;
		}
		$res->close();				
		$con->close();
		return $record;
	}
	
	public function getUsers($arg="") {
		$con = new mysqli($this->db_host, $this->db_user, $this->db_pwd, $this->db_name);
		$res = $con->query("SELECT id, username, password, permission, last_log, date_created FROM users ORDER BY username");				
		$records = array();
		while ($row = $res->fetch_assoc()) {
			$row['last_log'] = $this->toRegDate($row['last_log']);
			$row['date_created'] = $this->toRegDate($row['date_created']);
			$records[] = $row;
		}
		$res->close();				
		$con->close();
		return $records;
	}
	
	public function authenticate($username, $password) {
		$con = new mysqli($this->db_host, $this->db_user, $this->db_pwd, $this->db_name);
		$res = $con->prepare("SELECT id, username, password, permission, last_log, date_created FROM users WHERE username = ? AND password = sha1(?)");
		$duser = $this->strToDb($username);
		$dpass = $this->strToDb($password);
		$res->bind_param("ss", $duser, $dpass);
		$res->bind_result($id, $usr, $pwd, $permission, $last_log, $date_created);
		$res->execute();
		$record = array();
		while ($row = $res->fetch()) {
			$last_log = $this->toRegDate($last_log);
			$date_created = $this->toRegDate($date_created);
			$record = array('id'=>$id, 'username'=>$username, 'password'=>$pwd, 'permission'=>$permission, 'last_log'=>$last_log, 'date_created'=>$date_created);
		}
		$res->close();				
		if (isset($record['id'])) $con->query("UPDATE users SET last_log = NOW() WHERE id = " . $record['id']);
		$con->close();
		return $record;
	}
	
}

?>
