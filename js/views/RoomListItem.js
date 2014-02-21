//VIEW list of guests
define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	//collection of guest models (guest collection)
	'models/room',
	//views
	'views/RoomDetail'
], function($, _, Backbone, Handlebars, ModelGuest, RoomDetailView) {

	var RoomListViewItem = Backbone.View.extend({
		tagName: "tr",
		forChoosing : false,
		initialize : function(options) {
			var self = this;
			this.model = options.model;
			this.forChoosing = options.forChoosing;
		},
		render : function() {			
			//set template using handlebars (todo)
			var html = "<td>" + this.model.get("roomNo") + "</td>";
			html += "<td>" + this.model.get("description") + "</td>";
			html += "<td>" + this.model.get("roomType") + "</td>";
			html += "<td style='text-align: right;'>" + (this.model.get("price") / 100).formatMoney(2, ' ') + "</td>";
			html += "<td width='50' class='button'><i class='icon-remove' style='display: none; cursor: pointer;' id='btnRemove'></i></td>";			
			this.$el.html(html);
			return this;			
		},
		events : {
			"mouseover": "showRemoveButton",
			"mouseout": "hideRemoveButton",
			"click #btnRemove": "removeGuest",
			"click td:not(.button)": "editRoom"
		},
		showRemoveButton: function() {
			if (this.forChoosing) return;
			$("#btnRemove", this.$el).show();
		},
		hideRemoveButton: function() {
			$("#btnRemove", this.$el).hide();
		},
		editRoom : function() {
			var roomDetailView = new RoomDetailView({model : this.model});
			this.$el.hide();
			$(roomDetailView.render().el).insertAfter(this.el);
			var self = this;
			roomDetailView.on('closeRoom', function() {
				this.close();
				self.$el.fadeIn();
			});

			roomDetailView.on('saveRoom', function() {
				this.close();
				self.render();
				self.$el.fadeIn();
			});
			return false;
		},
		removeGuest: function() {
			if (!confirm("Delete room record from the database?")) return false;
			var self = this;
			this.model.destroy({
				wait: true,
				success: function(model, response) {
					self.trigger("roomRemoved");
				}
			});
			return false;
		},
		viewGuestDetails: function(event) {			
		},
		onClose : function() {
		}
	});
	
	return RoomListViewItem;

});
