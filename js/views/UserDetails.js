//boilerplate
define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'libs/jquery/jqueryui',
	//collection of guest models (guest collection)
	'models/user',	
	//template for guest list
	'text!templates/userForm.html'	
], function($, _, Backbone, Handlebars, $ui, UserModel, txtTemplate) {
	var UserDetailsView = Backbone.View.extend({		
		//el: $("#modalDiv .modal-body"),
		initialize: function(options) {
			var self = this;												
			this.model = options.model;			
			this.operation = 'new';
			if (typeof options.operation !== 'undefined') this.operation = options.operation;		
			this.model.on("invalid", function(model, error) {
				$("#status", self.$el).attr("class", "alert alert-error").html(error);
			});									
		},
		render: function() {			
			//set template using handlebars (todo)
			var template = Handlebars.compile(txtTemplate);
			var html = template(this.model.toJSON());
			this.$el.html(html);			
			//show ui
			$(".modal-backdrop").fadeIn("fast");
			$("#modalDiv").css({"margin": "-225px 0px 0px -175px", "width": "350px", "height": "450"}).show();
			$("h3#modalLabel").html("User Information");
			var self = this;
			$("button#btnModalClose").click(function() {				
				self.close();
			});
			
			if (this.operation != 'update') {				
				$('button#btnSave', this.$el).hide();
				$('button#btnSavePassword', this.$el).hide();
				$('button#btnSaveNew', this.$el).show();								
			} 
			return this;
		},
		//events
		events : {
			"click button#btnSave" : "updateUser",
			"click button#btnSavePassword" : "updatePassword",
			'click button#btnSaveNew' : 'saveNewUser'
		},
		updateUser: function(event) {	//updates or saves existing/new guest record
			event.preventDefault();		
			var self = this;
			this.model.save({
				'username' : $('#username').val(),
				'permission' : $('#permission').val()
			},{
				"success": function(model, response) {					
					$("#status", self.$el).attr("class", "alert alert-success").html("User was updated.");
					self.trigger('userChanged', model);					
				}
			});			
			return false;
		},
		updatePassword : function(event) {
			event.preventDefault();
			var pass1 = $("#password").val(), pass2 = $("#password2").val();
			if (pass1 != pass2) {
				$("#status", this.$el).attr("class", "alert alert-error").html("Please retype your password.");
				return false;
			}
			if (_.isEmpty(pass1)) {
				$("#status", this.$el).attr("class", "alert alert-error").html("Please enter a password.");
				return false;
			}
			
			var self = this;
			this.model.save({
				'password' : $('#password').val()
			}, {				
				'success': function(model, reponse) {
					$("#status", self.$el).attr("class", "alert alert-success").html("Password was updated.");
					self.trigger('userChanged', model);					
				}
			});
			return false;
		},
		saveNewUser : function(event) {
			event.preventDefault();
			var pass1 = $("#password").val(), pass2 = $("#password2").val();
			if (pass1 != pass2) {
				$("#status", this.$el).attr("class", "alert alert-error").html("Please retype your password.");
				return false;
			}
			if (_.isEmpty(pass1)) {
				$("#status", this.$el).attr("class", "alert alert-error").html("Please enter a password.");
				return false;
			}
			
			var self = this;
			this.model.save({
				'username' : $('#username').val(),
				'password' : $('#password').val(),
				'permission' : $('#permission').val()
			}, {				
				'success': function(model, reponse) {
					$("#status", self.$el).attr("class", "alert alert-success").html("New user was added.");
					self.trigger('userAdd', model);					
				}
			});
			return false;
		},
		clearUser: function() {
			$("#fullname").val("");
			$("#citizenship").val("");
			$("#dob").val("");
			$("#contact_no").val("");
			$("#email").val("");
			$("#company").val("");
			$("#position").val("");
			return false;
		},
		onClose: function(event) {			
			$("div#modalDiv").hide();
			$("div#modalBackdrop").fadeOut("fast");			
		}
	});
	
	return UserDetailsView;

});
