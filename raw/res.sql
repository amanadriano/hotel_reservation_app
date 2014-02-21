-- Adminer 3.7.1 MySQL dump

SET NAMES utf8;
SET foreign_key_checks = 0;
SET time_zone = '+08:00';
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP DATABASE IF EXISTS `res`;
CREATE DATABASE `res` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `res`;

DROP TABLE IF EXISTS `charges`;
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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `charges` (`id`, `description`, `amount`, `qty`, `qty_cost`, `name`, `action`, `checkinId`, `date`) VALUES
(25,	'',	120000,	1,	120000,	'Room Charge',	1,	4,	'2013-04-27 00:00:00'),
(31,	'Room Charge',	50000,	1,	50000,	'Room Charge',	1,	8,	'2013-05-23 08:09:00'),
(34,	'checked out',	0,	1,	0,	'Room Charge',	2,	4,	'2013-04-30 11:41:00'),
(35,	'payment through card',	360000,	1,	360000,	'Payment',	3,	4,	'2013-04-30 11:41:00'),
(42,	'Room Charge',	90000,	1,	90000,	'Room Charge',	1,	12,	'2013-05-25 23:08:00'),
(43,	'Deposit received during reservation.',	150000,	1,	150000,	'Payment',	3,	12,	'2013-05-25 23:08:00'),
(46,	'Room Charge',	120000,	1,	120000,	'Room Charge',	1,	15,	'2013-05-28 09:18:00'),
(51,	'stop',	0,	1,	0,	'Room Charge',	2,	8,	'2013-05-31 00:00:00'),
(52,	'payment received',	350000,	1,	350000,	'Payment',	3,	8,	'2013-05-30 12:00:00'),
(53,	'',	0,	1,	0,	'Room Charge',	2,	15,	'2013-06-01 00:00:00'),
(54,	'',	360000,	1,	360000,	'Payment',	3,	15,	'2013-06-01 19:22:00'),
(55,	'stop',	0,	1,	0,	'Room Charge',	2,	12,	'2013-06-01 00:00:00'),
(56,	'card payment',	390000,	1,	390000,	'Payment',	3,	12,	'2013-05-31 00:00:00'),
(61,	'Room Charge',	90000,	1,	90000,	'Room Charge',	1,	19,	'2013-06-11 23:20:00'),
(64,	'Room Charge',	50000,	1,	50000,	'Room Charge',	1,	21,	'2013-06-12 09:19:00'),
(71,	'Room Charge',	160000,	1,	160000,	'Room Charge',	1,	26,	'2013-06-12 22:20:00'),
(72,	'Deposit received during reservation.',	50000,	1,	50000,	'Payment',	3,	26,	'2013-06-12 22:20:00'),
(75,	'adfasdfasdf',	50000,	1,	50000,	'Restaurant',	0,	21,	'2013-06-12 14:50:00'),
(76,	'choco',	2550,	1,	2550,	'Mini Bar',	0,	26,	'2013-06-14 13:00:00'),
(79,	'Room Charge',	50000,	1,	50000,	'Room Charge',	1,	28,	'2013-06-20 09:00:00'),
(80,	'card',	50000,	1,	50000,	'Deposit',	3,	28,	'2013-06-22 10:27:00'),
(81,	'',	0,	1,	0,	'Room Charge',	2,	21,	'2013-06-14 00:00:00'),
(82,	'',	100000,	1,	100000,	'Payment',	3,	21,	'2013-06-13 12:00:00'),
(83,	'',	0,	1,	0,	'Room Charge',	2,	26,	'2013-06-16 00:00:00'),
(84,	'',	432550,	1,	432550,	'Payment',	3,	26,	'2013-06-15 12:00:00'),
(85,	'',	0,	1,	0,	'Room Charge',	2,	19,	'2013-06-13 00:00:00'),
(86,	'',	90000,	1,	90000,	'Payment',	3,	19,	'2013-06-12 12:00:00'),
(91,	'Room Charge',	90000,	1,	90000,	'Room Charge',	1,	32,	'2013-06-25 17:02:00'),
(95,	'Room Charge',	90000,	1,	90000,	'Room Charge',	1,	34,	'2013-08-24 09:00:00'),
(96,	'received as credit card ',	90000,	1,	90000,	'Deposit',	3,	34,	'2013-08-21 21:42:00'),
(98,	'cash',	5220000,	1,	5220000,	'Payment',	3,	32,	'2013-08-21 00:00:00'),
(100,	'Room Charge',	120000,	1,	120000,	'Room Charge',	1,	36,	'2013-12-03 00:00:00'),
(101,	'drinkss',	5000,	1,	5000,	'Mini Bar',	0,	36,	'2013-12-03 13:00:00'),
(102,	'test',	600,	1,	600,	'Room Charge',	0,	36,	'2013-12-04 00:00:00'),
(103,	'Room Charge',	50000,	1,	50000,	'Room Charge',	1,	37,	'2013-12-05 00:00:00');

DROP TABLE IF EXISTS `checkins`;
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
  `bookBy` varchar(30) NOT NULL,
  `bookDesc` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `guestId` (`guestId`),
  CONSTRAINT `checkins_ibfk_1` FOREIGN KEY (`guestId`) REFERENCES `guests` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `checkins` (`id`, `guestId`, `checkIn`, `checkOut`, `roomId`, `status`, `roomPrice`, `pax`, `children`, `bookBy`, `bookDesc`) VALUES
(4,	4,	'2013-04-27 10:17:00',	'2013-04-30 11:41:00',	1,	'OUT',	120000,	1,	0,	'',	''),
(8,	14,	'2013-05-23 10:09:00',	'2013-05-30 12:00:00',	29,	'OUT',	50000,	2,	0,	'',	''),
(12,	15,	'2013-05-25 23:08:00',	'2013-05-31 00:00:00',	2,	'OUT',	90000,	1,	0,	'',	''),
(15,	11,	'2013-05-28 09:18:00',	'2013-05-31 00:00:00',	1,	'OUT',	120000,	1,	0,	'',	''),
(19,	11,	'2013-06-11 23:20:00',	'2013-06-12 12:00:00',	2,	'OUT',	90000,	1,	0,	'',	''),
(21,	5,	'2013-06-12 09:19:00',	'2013-06-13 12:00:00',	29,	'OUT',	50000,	1,	0,	'',	''),
(26,	11,	'2013-06-12 22:20:00',	'2013-06-15 12:00:00',	3,	'OUT',	160000,	1,	0,	'',	''),
(28,	12,	'2013-06-18 09:00:00',	'2013-06-20 12:00:00',	29,	'RES',	50000,	1,	0,	'',	''),
(32,	5,	'2013-06-25 17:02:00',	'2013-06-29 12:00:00',	2,	'OUT',	90000,	2,	1,	'Direct Booking',	'Walked In'),
(34,	4,	'2013-08-24 09:00:00',	'2013-08-31 21:41:00',	2,	'RES',	90000,	2,	1,	'',	''),
(36,	4,	'2013-12-03 00:00:00',	'2013-12-07 00:00:00',	1,	'IN',	120000,	1,	0,	'',	''),
(37,	15,	'2013-12-05 00:00:00',	'2013-12-17 00:00:00',	29,	'RES',	50000,	2,	0,	'',	'');

DROP TABLE IF EXISTS `guests`;
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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `guests` (`id`, `fullname`, `citizenship`, `dob`, `contact_no`, `email`, `company`, `position`) VALUES
(4,	'Aman Jake L. Adriano',	'Filipino',	'2009-07-17 00:00:00',	'09184030903',	'secondrnd@gmail.com',	'Leon, Inc.',	'PRogrammer'),
(5,	'Leon Thomas F. Adriano',	'Filipino',	'2009-07-17 00:00:00',	'0123456789',	'leonthomas@gmail.com',	'Leon, Inc.',	'Baby'),
(11,	'Rodellaine Flordeliza',	'Filipino',	'1982-09-10 00:00:00',	'09085422146',	'',	'',	''),
(12,	'el NiÃ‘o',	'filipino',	'1981-12-02 00:00:00',	'12341234',	'',	'',	''),
(13,	'asdf',	'asdf',	'1980-12-02 00:00:00',	'adsfasdf',	'',	'',	''),
(14,	'superman',	'test',	'1981-12-02 00:00:00',	'09140192341234',	'',	'',	''),
(15,	'mc donald',	'pinoy',	'1970-01-01 00:00:00',	'123412341234',	'mcdo@mcdonal.com',	'',	'');

DROP TABLE IF EXISTS `payments`;
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


DROP TABLE IF EXISTS `reservations`;
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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `reservations` (`id`, `guestId`, `checkin`, `checkout`, `roomId`, `status`, `pax`, `children`, `deposit`, `depositDate`, `roomPrice`) VALUES
(2,	12,	'2013-05-13 00:00:00',	'2013-05-17 00:00:00',	3,	'RES',	2,	1,	100000,	'0000-00-00 00:00:00',	160000),
(3,	15,	'2013-05-31 09:00:00',	'2013-06-03 12:00:00',	3,	'RES',	2,	1,	100000,	'2013-05-30 08:00:00',	160000),
(5,	5,	'2013-06-18 10:00:00',	'2013-06-22 12:00:00',	1,	'RES',	2,	0,	60000,	'2013-06-14 12:12:00',	120000),
(6,	14,	'2013-06-18 00:00:00',	'2013-06-21 12:00:00',	2,	'RES',	2,	1,	60000,	'2013-06-14 15:59:00',	90000),
(7,	15,	'2013-06-17 06:00:00',	'2013-06-18 11:59:00',	29,	'RES',	1,	0,	30000,	'2013-06-16 08:36:00',	50000),
(8,	12,	'2013-06-19 09:00:00',	'2013-06-24 12:00:00',	3,	'RES',	3,	1,	60000,	'2013-06-16 10:02:00',	160000);

DROP TABLE IF EXISTS `rooms`;
CREATE TABLE `rooms` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `roomNo` smallint(5) unsigned NOT NULL,
  `roomType` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `price` mediumint(8) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roomNo` (`roomNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `rooms` (`id`, `roomNo`, `roomType`, `description`, `price`) VALUES
(1,	1,	'DELUXE',	'1 Single Bed, Aircon, Tv, Bathroom',	120000),
(2,	10,	'SINGLE',	'Single Bed, Good for 1 person only.',	90000),
(3,	2,	'Deluxe',	'Deluxe Room, Double Bed',	160000),
(29,	3,	'Standard',	'Standard room, standard bed, standard food, standard everything',	50000),
(30,	4,	'Standard',	'Test Description',	120000);

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(30) NOT NULL,
  `password` char(40) NOT NULL,
  `permission` tinyint(4) NOT NULL,
  `last_log` datetime NOT NULL,
  `date_created` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `users` (`id`, `username`, `password`, `permission`, `last_log`, `date_created`) VALUES
(1,	'amanadriano',	'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',	2,	'2013-08-21 21:29:47',	'2013-05-19 08:40:20'),
(7,	'leonthomas',	'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',	1,	'2013-06-09 15:59:43',	'2013-05-19 09:23:06'),
(8,	'admin',	'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',	3,	'2013-12-03 01:48:00',	'2013-05-22 16:49:43');

-- 2013-12-03 02:10:00
