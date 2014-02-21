define([	
	'underscore',
	'backbone',
	'models/room'
], function(_, Backbone, RoomModel) {
	//guest collection
	var RoomsCollection = Backbone.Collection.extend ({
		model : RoomModel,
		url : "php/model.room.php"
	});	
	return RoomsCollection;

});

