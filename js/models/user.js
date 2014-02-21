//guest model
define([
	'underscore', 'backbone'
], function(_, Backbone) {
	var UserModel = Backbone.Model.extend ({
		defaults : {
			username : "",
			password : "",
			permission : 1,
			last_log : "",
			date_created : ""			
		},		
		url : function() {
			if (this.isNew()) return "php/model.user.php";
			return "php/model.user.php?id=" + this.id;			
		},
		validate: function(attrs) {			
			if (_.isEmpty(attrs.username)) {
				return "Missing username.";
			} else if (_.isEmpty(attrs.password)) {				
				return "Password cannot be blank.";
			}			
		}
	});

	return UserModel;
});
