//checkin model
define([
	'underscore', 'backbone'
], function(_, Backbone) {
	var ChargeModel = Backbone.Model.extend ({
		defaults : {			
			description : "",
			amount : 0,
			qty : 1,
			qty_cost : 0,
			name : "",
			action : 0,			//int: [0=n/a,1=recurring charge, 2=returned item]
			checkinId : 0,		//checkin ID to where this charge belongs to
			date : "",
			fullname : ""		
		},		
		url : function() {
			if (this.isNew()) return "php/model.charge.php";
			return "php/model.charge.php?id=" + this.id;			
		},
		validate: function(attrs) {						
			if (_.isEmpty(attrs.date)) {
				return "Please provide a valid date for this transaction.";
			} else if (isNaN(attrs.qty)) {
				return "Please enter a valid quantity value.";
			} else if (attrs.qty <= 0) {
				return "Please enter a quantity value greater than 0.";
			} else if (isNaN(attrs.qty_cost)) {
				return "Please enter a valid price/unit.";			
			} else if (isNaN(attrs.amount)) {
				return "Please provide a valid numeric value for the total amount of this entry. Make sure you have a numeric value for the quantity and price/unit.";
			}
		}
	});

	return ChargeModel;
});
