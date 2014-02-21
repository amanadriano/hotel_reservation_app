define([	
	'underscore',
	'backbone',
	'models/user'
], function(_, Backbone, UserModel) {
	//guest collection
	var UserCollection = Backbone.Collection.extend ({
		model : UserModel,		
		url : "php/model.user.php"
	});	
	return UserCollection;

});

