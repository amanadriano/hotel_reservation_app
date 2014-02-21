//VIEW list of guests
define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	//collection of guest models (guest collection)
	'collections/rooms',
	'models/room',
	//template for guest list
	'text!templates/rooms.html',
	//listviewitem
	'views/RoomListItem',
	'views/RoomDetail'
], function($, _, Backbone, Handlebars, RoomsCollection, RoomModel, txtTemplate, RoomListViewItem, RoomDetailView) {

	var RoomListView = Backbone.View.extend({		
		//el: $('#main-content'),
		forChoosing : false,
		initialize : function(options) {
			var self = this;			
			if (!_.isUndefined(options)) this.forChoosing = options.forChoosing;
			this.collection = new RoomsCollection();
			this.collection.comparator = function(room) {
				return Math.abs(room.get("roomNo"));
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
			this.collection.each(function(room) {
				var roomListItem = new RoomListViewItem({model: room});
				roomListItem.on('roomRemoved', function() {
						self.collection.remove(this.model);	//check if this is necessary
						self.render();
					}, this);
				roomListItem.on('roomUpdated', function() {						
						self.render();
					}, this);
				$("tbody", self.$el).append(roomListItem.render().el);
			});
			return this;
		},
		events : {
			"click button#btnSearch": "searchGuests",
			"click button#btnNew": "newRoom"
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
		newRoom : function(event) {
			event.preventDefault();
			if (typeof this.roomDetailView !== 'undefined') return false;
			var self = this;
			var roomModel = new RoomModel();
			this.roomDetailView = new RoomDetailView({model : roomModel});
			$("table", this.$el).prepend(this.roomDetailView.render().el);
			this.roomDetailView.on({
				'closeRoom' : function() {
					$(this.$el).fadeOut(function() {
						self.roomDetailView.close();
						delete self.roomDetailView;
					});
				},
				'saveRoom' : function() {
					self.collection.add(this.model);
					this.close();
					self.render();
					delete self.roomDetailView;
					$("#status").addClass("alert alert-success").html("Room #" + roomModel.get('roomNo') + " was added to the database.").show().delay(5000).fadeOut();
				}
			});
			return false;
		},
		onClose : function() {
			if (this.guestDetailsView) {
				this.guestDetailsView.close();
			}
		}
		
	});
	
	return RoomListView;

});
