//checkin model
define([
	'underscore', 'backbone'
], function(_, Backbone) {
	var ReservationModel = Backbone.Model.extend ({
		defaults : {			
			guestId : 0,		//id of guest record
			fullname : "",
			checkIn : "",		//date
			checkOut : "",		//date
			roomId : 0,			//id of room record
			roomNo : 0,
			roomPrice : 0,	//cost of current room
			status : "",		//#status of stay
			pax : 1,			//# of adult	
			children : 0,		//# of children
			deposit : 0,		//amount of deposit upon reservation
			depositDate : ""
		},		
		url : function() {
			if (this.isNew()) return "php/model.reservation.php";
			return "php/model.reservation.php?id=" + this.id;			
		},
		validate: function(attrs) {						
			if (_.isEmpty(attrs.checkIn)) {				
				return "Check in date is required.";
			} else if (_.isEmpty(attrs.checkOut)) {
				return "Check out date is required.";
			} else if (attrs.roomId == 0) {
				return "Please choose a room.";
			} else if (isNaN(attrs.roomPrice)) {
				return "Please indicate the charge per night of the selected room.";
			} else if (attrs.guestId == 0) {
				return "Please choose or create a guest.";
			} else if (attrs.pax == 0 && attrs.children == 0) {
				return "You must enter the number of pax.";
			} else if (isNaN(attrs.deposit)) {
				return "Enter a valid numeric value for the deposit.";
			}
		}
	});

	return ReservationModel;
});
