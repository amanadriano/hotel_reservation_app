define([	
	'underscore',
	'backbone',
	'models/charge'
], function(_, Backbone, ChargeModel) {
	//guest collection
	var ChargeCollection = Backbone.Collection.extend ({
		model : ChargeModel,
		url : "php/model.charge.php"
	});	
	return ChargeCollection;

});

