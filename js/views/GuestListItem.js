//VIEW list of guests
define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	//collection of guest models (guest collection)
	'models/guest',
	//views
	'views/GuestDetails'
], function($, _, Backbone, Handlebars, ModelGuest, GuestDetailsView) {

	var GuestListViewItem = Backbone.View.extend({
		tagName: "tr",
		forChoosing : false,
		initialize : function(options) {
			var self = this;
			this.model = options.model;
			this.forChoosing = options.forChoosing;
		},
		render : function() {			
			//set template using handlebars (todo)
			var html = "<td><a href=''>" + this.model.get("fullname") + "</a></td>";
			html += "<td>" + this.model.get("contact_no") + "</td>";
			html += "<td>" + this.model.get("email") + "</td>";
			html += "<td width='50'><i class='icon-remove' style='display: none; cursor: pointer;' id='btnRemove'></i></td>";			
			this.$el.html(html);
			return this;			
		},
		events : {
			"mouseover": "showRemoveButton",
			"mouseout": "hideRemoveButton",
			"click #btnRemove": "removeGuest",
			"click a": "viewGuestDetails"
		},
		showRemoveButton: function() {
			if (this.forChoosing) return;
			$("#btnRemove", this.$el).show();
		},
		hideRemoveButton: function() {
			$("#btnRemove", this.$el).hide();
		},
		removeGuest: function() {
			if (this.forChoosing) return;
			if (!confirm("Delete this guest from the database?")) return false;
			var self = this;
			this.model.destroy({
				wait: true,
				success: function(model, response) {
					if (!_.isUndefined(self.guestDetailsView)) self.guestDetailsView.off('formSubmitted', this.render, this);
					self.undelegateEvents();
					self.$el.fadeOut("slow").remove();
					self.trigger("guestRemoved");
				}
			});
			return false;
		},
		viewGuestDetails: function(event) {			
			event.preventDefault();
			//if this was called for choosing a guest only trigger guestSelected event for checkin form
			if (this.forChoosing) {
				this.trigger("guestSelected", this.model);
				return false;
			}
			//Backbone.history.loadUrl("guest/" + this.model.get("id"));
			this.guestDetailsView = new GuestDetailsView({model : this.model});
			this.guestDetailsView.on('formSubmitted', function() {
					this.render();
					this.trigger("guestRecordChanged");
				}, this);
			this.guestDetailsView.render();
			$("#modalDiv .modal-body").html(this.guestDetailsView.el);
			return false;
		},
		onClose : function() {
			if (this.guestDetailsView) {
				this.guestDetailsView.close();
			}
		}
	});
	
	return GuestListViewItem;

});
