//VIEW list of guests
define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	//collection of guest models (guest collection)
	'collections/guests',
	'models/guest',
	//template for guest list
	'text!templates/guests.html',
	//listviewitem
	'views/GuestListItem',
	'views/GuestDetails'
], function($, _, Backbone, Handlebars, GuestsCollection, GuestModel, txtTemplate, GuestListViewItem, GuestDetailsView) {

	var GuestListView = Backbone.View.extend({		
		//el: $('#main-content'),
		forChoosing : false,
		initialize : function(options) {
			var self = this;			
			if (!_.isUndefined(options)) this.forChoosing = options.forChoosing;
			this.collection = new GuestsCollection();
			this.collection.comparator = function(guest) {
				return guest.get("roomId");
			};
			
			this.collection.fetch({
				"wait": true,
				"success": function(collection, response, options) {
					self.render();
				}
			});									
		},
		render : function() {			
			//set template using handlebars (todo)
			var self = this;
			var template = Handlebars.compile(txtTemplate);
			var html = template({});
			this.$el.html(html);
			this.collection.sort();
			this.collection.each(function(guest) {
				var guestListItem = new GuestListViewItem({model: guest, forChoosing : self.forChoosing});
				guestListItem.on('guestRemoved', function() {
						self.collection.remove(this.model);
						self.render();
					}, this);
				guestListItem.on('guestRecordChanged', function() {						
						self.render();
					}, this);
				guestListItem.on("guestSelected", function(event) {						
						self.trigger("guestSelected", event);
					}, this);
				$("tbody", self.$el).append(guestListItem.render().el);
			});
			return this;
		},
		events : {
			"click button#btnSearch": "searchGuests",
			"click button#btnNew": "newGuest"			
		},
		searchGuests: function() {
			var self = this;
			this.collection.fetch({
				data : {search: $("#txtSearch").val()},
				"wait": true,
				"success": function(collection, response, options) {
					self.render();
				}
			});
			
			return false;
		},
		newGuest: function(event) {
			event.preventDefault();
			var self = this;
			var newGuestModel = new GuestModel();
			this.guestDetailsView = new GuestDetailsView({model : newGuestModel});
			this.guestDetailsView.on('formSubmitted', function(event) {
					if (self.forChoosing) {						
						self.trigger("guestSelected", event);
						self.close();
					} else {
						self.collection.add(newGuestModel);
						self.render();						
					}
				}, this);
			$("#modalDiv .modal-body").html(this.guestDetailsView.el);
			return false;
		},
		onClose : function() {
			if (this.guestDetailsView) {
				this.guestDetailsView.close();
			}
		}
		
	});
	
	return GuestListView;

});
