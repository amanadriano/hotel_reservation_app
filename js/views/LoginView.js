//VIEW list of guests
define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',	
	//template for guest list
	'text!templates/login.html',
	//listviewitem	
], function($, _, Backbone, Handlebars, txtTemplate) {

	var LoginView = Backbone.View.extend({				
		initialize : function(options) {			
		},
		render : function() {						
			var template = Handlebars.compile(txtTemplate);
			var html = template({});
			this.$el.html(html);
			$('#username', this.$el).focus();
			$('#nav-bar').hide();
			return this;
		},
		events : {			
			"click button#btnLogin": "logMeIn"
		},		
		logMeIn : function(event) {
			event.preventDefault();
			var formData = {
				'username' : $('#username').val(),
				'password' :  $('#password').val()
			};
			
			$.ajax({
				url:'php/checkLogin.php',
				type:'POST',
				dataType:"json",
				data: formData,
				success:function (data) {					
					if(data.error) {  // check for errors returned by php script
						$('#status').attr('class', 'alert alert-error').html(data.error.text).show();
					}
					else { // if there are no errors, user was logged in successfully
						$("a#navLogout").html("Log out");
						$("#greet").html("<p class='alert alert-info'>Hello <strong>" + data.username + "</strong>, haven't seen you since " + data.last_log + ".<a href='#' id='navLogout' class='pull-right'><i class='icon-check'></i> Logout</a></p>");
						window.location.replace('#reservations');
						$('#status').attr('class', 'alert alert-success').html("Welcome " + data.username).show();
						$('#nav-bar').fadeIn(200);
					}
				}
			});
			return false;
		},
		onClose : function() {
			
		}
		
	});
	
	return LoginView;

});
