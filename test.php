<?php
//echo phpinfo();
$datetime1 = date_create('2009-10-11');
$datetime2 = date_create('2009-10-13');
$interval = date_diff($datetime1, $datetime2);
date_add($datetime1, new DateInterval("P1D"));
echo $interval->invert;
echo $interval->days;
//echo $datetime1->format("M-d-Y");
//echo ($datetime1 < $datetime2);
?>
