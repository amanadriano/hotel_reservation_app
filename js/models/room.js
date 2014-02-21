//room model
define([
	'underscore', 'backbone'
], function(_, Backbone) {
	var RoomModel = Backbone.Model.extend ({
		defaults : {
			roomNo : 0, roomType : "", description : "", price : 0
		},		
		url : function() {
			if (this.isNew()) return "php/model.room.php";
			return "php/model.room.php?id=" + this.id;			
		},
		validate: function(attrs) {									
			if (isNaN(attrs.roomNo)) {
				return "Please provide a valid room number.";
			} else if (_.isEmpty(attrs.roomType)) {
				return "Please enter a room type.";
			} else if (_.isEmpty(attrs.description)) {
				return "Please enter a description for this room.";
			} else if (isNaN(attrs.price)) {
				return "Please provide a valid numeric value for the price/nigth of this room.";
			}
		}
	});

	return RoomModel;
});
