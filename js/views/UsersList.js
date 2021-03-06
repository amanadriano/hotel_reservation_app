//VIEW list of guests
define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	//collection of guest models (guest collection)
	'collections/users',
	'models/user',
	//template for guest list
	'text!templates/users.html',
	//listviewitem
	'views/UserListItem',
	'views/UserDetails'
], function($, _, Backbone, Handlebars, UsersCollection, UserModel, txtTemplate, UserListViewItem, UserDetailsView) {

	var UsersView = Backbone.View.extend({		
		//el: $('#main-content'),
		forChoosing : false,
		initialize : function(options) {
			var self = this;						
			this.collection = new UsersCollection();
			this.collection.comparator = function(user) {
				return user.get("username");
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
			this.collection.each(function(user) {				
				var userListItem = new UserListViewItem({model: user});
				userListItem.on('userRemoved', function() {					
						self.collection.remove(this.model);						
					}, this);
				userListItem.on('userChanged', function() {						
						self.render();
					}, this);				
				$("tbody", self.$el).append(userListItem.render().el);
			});
			return this;
		},
		events : {			
			"click button#btnNew": "newUser"
		},		
		newUser: function(event) {
			event.preventDefault();
			var self = this;
			var newModel = new UserModel();
			this.userDetailsView = new UserDetailsView({model : newModel, 'operations': 'new'});
			this.userDetailsView.on('userAdd', function(event) {
				self.collection.fetch({
					"wait": true,
					"success": function(collection, response, options) {
						self.render();
					}
				});									
			}, this);
			$("#modalDiv .modal-body").html(this.userDetailsView.render().el).show();			
			return false;
		},
		onClose : function() {
			if (this.guestDetailsView) {
				this.guestDetailsView.close();
			}
		}
		
	});
	
	return UsersView;

});
