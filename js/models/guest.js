//guest model
define([
	'underscore', 'backbone'
], function(_, Backbone) {
	var GuestModel = Backbone.Model.extend ({
		defaults : {
			fullname : "",
			citizenship : "",
			dob : "",
			contact_no : "",
			email : "",
			company : "",
			position : ""
		},		
		url : function() {
			if (this.isNew()) return "php/model.guest.php";
			return "php/model.guest.php?id=" + this.id;			
		},
		validate: function(attrs) {			
			if (_.isEmpty(attrs.fullname)) {
				return "Enter guest's fullname";
			} else if (_.isEmpty(attrs.citizenship)) {				
				return "Enter guest's citizenship";
			} else if (_.isEmpty(attrs.dob)) {
				return "Enter guest's birthday";
			}
			
		}
	});

	return GuestModel;
});
