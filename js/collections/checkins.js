define([	
	'underscore',
	'backbone',
	'models/checkin'
], function(_, Backbone, CheckinModel) {
	//guest collection
	var CheckinCollection = Backbone.Collection.extend ({
		model : CheckinModel,
		url : "php/model.checkin.php"
	});	
	return CheckinCollection;

});

