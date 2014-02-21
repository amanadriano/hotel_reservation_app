//VIEW list of guests
define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	//collection of guest models (guest collection)
	'models/reservation',
	//views
	'views/CheckinDetails'
], function($, _, Backbone, Handlebars, ReservationModel) {

	var ReservationListItemView = Backbone.View.extend({
		tagName: "tr",
		forChoosing : false,
		initialize : function(options) {
			var self = this;
			this.model = options.model;
			this.forChoosing = options.forChoosing;
		},
		render : function() {			
			//set template using handlebars (todo)
			var totalPax = parseInt(this.model.get("pax")) + parseInt(this.model.get("children"));
			var html = "<td><a href=''>" + this.model.get("fullname") + "</a></td>";
			html += "<td align='center'>" + this.model.get("roomNo") + "</td>";
			html += "<td align='center'>" + this.model.get("checkIn") + "</td>";
			html += "<td align='center'>" + this.model.get("checkOut") + "</td>";
			html += "<td align='center'>" + totalPax + "</td>";
			html += "<td align='center'>" + this.model.get("status") + "</td>";
			//html += "<td width='50'><i class='icon-remove' style='display: none; cursor: pointer;' id='btnRemove'></i></td>";			
			this.$el.html(html);
			return this;			
		},
		events : {
			"mouseover": "showRemoveButton",
			"mouseout": "hideRemoveButton",
			"click" : "showCheckinInformation"
		},
		showRemoveButton: function() {
			if (this.forChoosing) return;
			$("#btnRemove", this.$el).show();
		},
		hideRemoveButton: function() {
			$("#btnRemove", this.$el).hide();
		},
		showCheckinInformation: function(event) {			
			event.preventDefault();
			this.trigger("checkinClick", this.model);
			return false;
		},
		onClose : function() {
			//~ if (this.guestDetailsView) {
				//~ this.guestDetailsView.close();
			//~ }
		}
	});
	
	return ReservationListItemView;

});
