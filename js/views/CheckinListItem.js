//VIEW list of guests
define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	//collection of guest models (guest collection)
	'models/charge',
	//views
	'views/CheckinDetails'
], function($, _, Backbone, Handlebars, ChargeModel, CheckinDetailsView) {

	var ChargeListItemView = Backbone.View.extend({
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
		removeCheckin: function() {
			//~ if (this.forChoosing) return;
			//~ if (!confirm("Delete this guest from the database?")) return;
			//~ var self = this;
			//~ this.model.destroy({
				//~ wait: true,
				//~ success: function(model, response) {
					//~ if (!_.isUndefined(self.guestDetailsView)) self.guestDetailsView.off('formSubmitted', this.render, this);
					//~ self.undelegateEvents();
					//~ self.$el.fadeOut("slow").remove();
					//~ self.trigger("guestRemoved");
				//~ }
			//~ });
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
	
	return ChargeListItemView;

});
