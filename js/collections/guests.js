define([	
	'underscore',
	'backbone',
	'models/guest'
], function(_, Backbone, GuestModel) {
	//guest collection
	var GuestCollection = Backbone.Collection.extend ({
		model : GuestModel,
		//url : "php/collection.guest.php"
		url : "php/model.guest.php"
	});	
	return GuestCollection;

});

