DROP TABLE charges;

CREATE TABLE `charges` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `description` varchar(200) DEFAULT NULL,
  `amount` mediumint(8) unsigned NOT NULL,
  `qty` smallint(5) unsigned NOT NULL,
  `qty_cost` mediumint(8) unsigned NOT NULL,
  `name` varchar(100) NOT NULL,
  `action` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `checkinId` bigint(20) unsigned NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `checkinId` (`checkinId`),
  CONSTRAINT `charges_ibfk_2` FOREIGN KEY (`checkinId`) REFERENCES `checkins` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=latin1;

INSERT INTO charges VALUES("1","room charge","1100","1","1100","Room Charge","1","1","2013-02-10 00:00:00");
INSERT INTO charges VALUES("2","drinks, beverages (mixed)","250","5","50","Mini Bar","0","1","2013-02-13 00:00:00");
INSERT INTO charges VALUES("3","credit card. 1654987321654968789","59650","1","59650","Payment","3","1","2013-04-05 00:00:00");
INSERT INTO charges VALUES("6","pay","1800","1","1800","Payment","3","2","2013-02-12 00:00:00");
INSERT INTO charges VALUES("8","","0","1","0","Room Charge","2","2","2013-02-12 00:00:00");
INSERT INTO charges VALUES("9","","900","1","900","Room Charge","1","2","2013-02-10 00:00:00");
INSERT INTO charges VALUES("10","cash","4000","1","4000","Payment","3","1","2013-04-09 00:00:00");
INSERT INTO charges VALUES("11","","0","1","0","Room Charge","2","1","2013-04-09 00:00:00");
INSERT INTO charges VALUES("12","","400","1","400","Payment","3","1","2013-04-09 00:00:00");
INSERT INTO charges VALUES("22","Deposit received during reservation.","50000","1","50000","Payment","3","7","2013-05-04 00:00:00");
INSERT INTO charges VALUES("24","","120000","1","120000","Room Charge","1","7","2013-05-04 00:00:00");
INSERT INTO charges VALUES("25","","120000","1","120000","Room Charge","1","4","2013-04-27 00:00:00");
INSERT INTO charges VALUES("26","","1030000","1","1030000","Payment","3","7","2013-05-13 00:00:00");
INSERT INTO charges VALUES("31","Room Charge","50000","1","50000","Room Charge","1","8","2013-05-23 08:09:00");
INSERT INTO charges VALUES("34","checked out","0","1","0","Room Charge","2","4","2013-04-30 11:41:00");
INSERT INTO charges VALUES("35","payment through card","360000","1","360000","Payment","3","4","2013-04-30 11:41:00");
INSERT INTO charges VALUES("36","Room Charge","120000","1","120000","Room Charge","1","9","2013-05-24 09:00:00");
INSERT INTO charges VALUES("37","Deposit received during reservation.","80000","1","80000","Payment","3","9","2013-05-24 09:00:00");
INSERT INTO charges VALUES("38","paid","280000","1","280000","Payment","3","9","2013-05-26 19:21:00");
INSERT INTO charges VALUES("40","Room Charge","160000","1","160000","Room Charge","1","11","2013-05-25 00:00:00");
INSERT INTO charges VALUES("41","Deposit received during reservation.","60000","1","60000","Payment","3","11","2013-05-25 09:00:00");
INSERT INTO charges VALUES("42","Room Charge","90000","1","90000","Room Charge","1","12","2013-05-25 23:08:00");
INSERT INTO charges VALUES("43","Deposit received during reservation.","150000","1","150000","Payment","3","12","2013-05-25 23:08:00");
INSERT INTO charges VALUES("46","Room Charge","120000","1","120000","Room Charge","1","15","2013-05-28 09:18:00");
INSERT INTO charges VALUES("47","breakfast set meal ","19600","2","9800","Restaurant","0","11","2013-05-28 08:25:00");
INSERT INTO charges VALUES("48","","0","1","0","Room Charge","2","11","2013-05-30 00:00:00");
INSERT INTO charges VALUES("49","","599600","1","599600","Payment","3","11","2013-05-29 22:05:00");
INSERT INTO charges VALUES("51","stop","0","1","0","Room Charge","2","8","2013-05-31 00:00:00");
INSERT INTO charges VALUES("52","payment received","350000","1","350000","Payment","3","8","2013-05-30 12:00:00");
INSERT INTO charges VALUES("53","","0","1","0","Room Charge","2","15","2013-06-01 00:00:00");
INSERT INTO charges VALUES("54","","360000","1","360000","Payment","3","15","2013-06-01 19:22:00");
INSERT INTO charges VALUES("55","stop","0","1","0","Room Charge","2","12","2013-06-01 00:00:00");
INSERT INTO charges VALUES("56","card payment","390000","1","390000","Payment","3","12","2013-05-31 00:00:00");
INSERT INTO charges VALUES("61","Room Charge","90000","1","90000","Room Charge","1","19","2013-06-11 23:20:00");
INSERT INTO charges VALUES("62","Room Charge","120000","1","120000","Room Charge","1","20","2013-06-11 23:15:00");
INSERT INTO charges VALUES("63","ASDASdf","50000","1","50000","Mini Bar","0","20","2013-06-12 08:48:00");
INSERT INTO charges VALUES("64","Room Charge","50000","1","50000","Room Charge","1","21","2013-06-12 09:19:00");
INSERT INTO charges VALUES("71","Room Charge","160000","1","160000","Room Charge","1","26","2013-06-12 22:20:00");
INSERT INTO charges VALUES("72","Deposit received during reservation.","50000","1","50000","Payment","3","26","2013-06-12 22:20:00");
INSERT INTO charges VALUES("73","","0","1","0","Room Charge","2","20","2013-06-16 00:00:00");
INSERT INTO charges VALUES("74","","530000","1","530000","Room Charge","3","20","2013-06-15 12:00:00");
INSERT INTO charges VALUES("75","adfasdfasdf","50000","1","50000","Restaurant","0","21","2013-06-12 14:50:00");
INSERT INTO charges VALUES("76","choco","2550","1","2550","Mini Bar","0","26","2013-06-14 13:00:00");
INSERT INTO charges VALUES("77","Room Charge","120000","1","120000","Room Charge","1","27","2013-06-16 10:02:00");
INSERT INTO charges VALUES("78","","0","1","0","Room Charge","2","21","2013-06-13 12:00:00");
INSERT INTO charges VALUES("79","Room Charge","50000","1","50000","Room Charge","1","28","2013-06-20 09:00:00");



DROP TABLE checkins;

CREATE TABLE `checkins` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `guestId` bigint(20) unsigned NOT NULL,
  `checkIn` datetime NOT NULL,
  `checkOut` datetime NOT NULL,
  `roomId` smallint(5) unsigned NOT NULL,
  `status` varchar(20) DEFAULT NULL,
  `roomPrice` mediumint(8) unsigned NOT NULL,
  `pax` smallint(5) unsigned NOT NULL,
  `children` smallint(5) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `guestId` (`guestId`),
  CONSTRAINT `checkins_ibfk_1` FOREIGN KEY (`guestId`) REFERENCES `guests` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=latin1;

INSERT INTO checkins VALUES("1","4","2013-02-10 00:00:00","2013-04-11 00:00:00","1","OUT","1100","3","1");
INSERT INTO checkins VALUES("2","5","2013-02-10 00:00:00","2013-02-12 00:00:00","2","OUT","0","3","1");
INSERT INTO checkins VALUES("4","4","2013-04-27 10:17:00","2013-04-30 11:41:00","1","OUT","120000","1","0");
INSERT INTO checkins VALUES("7","4","2013-05-04 00:00:00","2013-05-13 12:00:00","1","OUT","120000","2","1");
INSERT INTO checkins VALUES("8","14","2013-05-23 10:09:00","2013-05-30 12:00:00","29","OUT","50000","2","0");
INSERT INTO checkins VALUES("9","15","2013-05-24 09:00:00","2013-05-26 12:17:00","1","OUT","120000","1","0");
INSERT INTO checkins VALUES("11","4","2013-05-25 09:00:00","2013-05-29 22:05:00","3","OUT","160000","1","0");
INSERT INTO checkins VALUES("12","15","2013-05-25 23:08:00","2013-05-31 00:00:00","2","OUT","90000","1","0");
INSERT INTO checkins VALUES("15","11","2013-05-28 09:18:00","2013-05-31 00:00:00","1","OUT","120000","1","0");
INSERT INTO checkins VALUES("19","11","2013-06-11 23:20:00","2013-06-12 12:00:00","2","IN","90000","1","0");
INSERT INTO checkins VALUES("20","4","2013-06-11 23:15:00","2013-06-15 12:00:00","1","OUT","120000","1","0");
INSERT INTO checkins VALUES("21","5","2013-06-12 09:19:00","2013-06-13 12:00:00","29","IN","50000","1","0");
INSERT INTO checkins VALUES("26","11","2013-06-12 22:20:00","2013-06-15 12:00:00","3","IN","160000","1","0");
INSERT INTO checkins VALUES("27","13","2013-06-16 10:02:00","2013-06-17 12:00:00","1","IN","120000","1","0");
INSERT INTO checkins VALUES("28","12","2013-06-18 09:00:00","2013-06-20 12:00:00","29","RES","50000","1","0");



DROP TABLE guests;

CREATE TABLE `guests` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `fullname` varchar(250) NOT NULL,
  `citizenship` varchar(200) NOT NULL,
  `dob` datetime NOT NULL,
  `contact_no` varchar(50) NOT NULL,
  `email` varchar(200) NOT NULL,
  `company` varchar(200) NOT NULL,
  `position` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;

INSERT INTO guests VALUES("4","Aman Jake L. Adriano","Filipino","2009-07-17 00:00:00","09184030903","secondrnd@gmail.com","Leon, Inc.","PRogrammer");
INSERT INTO guests VALUES("5","Leon Thomas F. Adriano","Filipino","2009-07-17 00:00:00","0123456789","leonthomas@gmail.com","Leon, Inc.","Baby");
INSERT INTO guests VALUES("11","Rodellaine Flordeliza","Filipino","1982-09-10 00:00:00","09085422146","","","");
INSERT INTO guests VALUES("12","el NiÑo","filipino","1981-12-02 00:00:00","12341234","","","");
INSERT INTO guests VALUES("13","asdf","asdf","1980-12-02 00:00:00","adsfasdf","","","");
INSERT INTO guests VALUES("14","superman","test","1981-12-02 00:00:00","09140192341234","","","");
INSERT INTO guests VALUES("15","mc donald","pinoy","1970-01-01 00:00:00","123412341234","mcdo@mcdonal.com","","");



DROP TABLE payments;

CREATE TABLE `payments` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `checkinId` bigint(20) unsigned NOT NULL,
  `paymentDate` datetime NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `method` varchar(50) NOT NULL,
  `info` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `checkinId` (`checkinId`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`checkinId`) REFERENCES `checkins` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;




DROP TABLE reservations;

CREATE TABLE `reservations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `guestId` bigint(20) unsigned NOT NULL,
  `checkin` datetime NOT NULL,
  `checkout` datetime NOT NULL,
  `roomId` mediumint(8) unsigned NOT NULL,
  `status` varchar(20) NOT NULL,
  `pax` smallint(5) unsigned NOT NULL,
  `children` smallint(5) unsigned NOT NULL,
  `deposit` mediumint(8) unsigned NOT NULL,
  `depositDate` datetime NOT NULL,
  `roomPrice` mediumint(8) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `guestId` (`guestId`),
  CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`guestId`) REFERENCES `guests` (`id`) ON DELETE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

INSERT INTO reservations VALUES("2","12","2013-05-13 00:00:00","2013-05-17 00:00:00","3","RES","2","1","100000","0000-00-00 00:00:00","160000");
INSERT INTO reservations VALUES("3","15","2013-05-31 09:00:00","2013-06-03 12:00:00","3","RES","2","1","100000","2013-05-30 08:00:00","160000");
INSERT INTO reservations VALUES("5","5","2013-06-18 10:00:00","2013-06-22 12:00:00","1","RES","2","0","60000","2013-06-14 12:12:00","120000");
INSERT INTO reservations VALUES("6","14","2013-06-18 00:00:00","2013-06-21 12:00:00","2","RES","2","1","60000","2013-06-14 15:59:00","90000");
INSERT INTO reservations VALUES("7","15","2013-06-17 06:00:00","2013-06-18 11:59:00","29","RES","1","0","30000","2013-06-16 08:36:00","50000");
INSERT INTO reservations VALUES("8","12","2013-06-19 09:00:00","2013-06-24 12:00:00","3","RES","3","1","60000","2013-06-16 10:02:00","160000");



DROP TABLE rooms;

CREATE TABLE `rooms` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `roomNo` smallint(5) unsigned NOT NULL,
  `roomType` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `price` mediumint(8) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roomNo` (`roomNo`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=latin1;

INSERT INTO rooms VALUES("1","1","DELUXE","1 Single Bed, Aircon, Tv, Bathroom","120000");
INSERT INTO rooms VALUES("2","10","SINGLE","Single Bed, Good for 1 person only.","90000");
INSERT INTO rooms VALUES("3","2","Deluxe","Deluxe Room, Double Bed","160000");
INSERT INTO rooms VALUES("29","3","Standard","Standard room, standard bed, standard food, standard everything","50000");



DROP TABLE users;

CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(30) NOT NULL,
  `password` char(40) NOT NULL,
  `permission` tinyint(4) NOT NULL,
  `last_log` datetime NOT NULL,
  `date_created` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

INSERT INTO users VALUES("1","amanadriano","a94a8fe5ccb19ba61c4c0873d391e987982fbbd3","2","2013-06-20 08:40:22","2013-05-19 08:40:20");
INSERT INTO users VALUES("7","leonthomas","a94a8fe5ccb19ba61c4c0873d391e987982fbbd3","1","2013-06-09 15:59:43","2013-05-19 09:23:06");
INSERT INTO users VALUES("8","admin","d033e22ae348aeb5660fc2140aec35850c4da997","3","2013-06-20 08:50:37","2013-05-22 16:49:43");



