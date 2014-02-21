define([	
	'underscore',
	'backbone',
	'models/reservation'
], function(_, Backbone, ReservationModel) {
	//guest collection
	var ReservationCollection = Backbone.Collection.extend ({
		model : ReservationModel,
		url : "php/model.reservation.php"
	});	
	return ReservationCollection;

});

