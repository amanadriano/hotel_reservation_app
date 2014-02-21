// Filename: app.js
define([
	"jquery",
	"underscore",
	"backbone",
	"handlebars",
	"router"
], function($, _, Backbone, Handlebars, Router) {

	var initialize = function() {
		Backbone.View.prototype.close = function() {
			this.remove();
			this.unbind();
			if (this.onClose) {
				this.onClose();
			}
		}
		
		Router.initialize();
		
		$("a#navGuests").click(function(event) {			
			event.preventDefault();
			Backbone.history.navigate("guests", {trigger: true});
		});
		
		$("a#navCheckins").click(function(event) {			
			event.preventDefault();
			Backbone.history.navigate("checkins", {trigger: true});
		});
		
		$("a#navReservations").click(function(event) {			
			event.preventDefault();
			Backbone.history.navigate("reservations", {trigger: true});
		});

		$("a#navRooms").click(function(event) {			
			event.preventDefault();
			Backbone.history.navigate("rooms", {trigger: true});
		});
		
		$("a#navReports").click(function(event) {			
			event.preventDefault();
			Backbone.history.navigate("reports", {trigger: true});
		});
		
		$("a#navUsers").click(function(event) {			
			event.preventDefault();
			Backbone.history.navigate("users", {trigger: true});
		});
		
		$("a#navLogout").click(function(event) {			
			event.preventDefault();
			Backbone.history.navigate("logout", {trigger: true});
		});

		function switchTabs(id) {
			$("li.active").attr("class","");
			$("a#" + id).closest("li").attr("class","active");
		}
		
		
		//handlebars helpers
		Handlebars.registerHelper('select', function( value, options ){				
				var $el = $('<select />').html( options.fn(this) );
				$el.find("[value='" + value + "']").attr({'selected':'selected'});
				return $el.html();
			});
			
		//helper to show integer value as decimal by dividing by 100. (money is stored as cents. Php 100 = 10000 Centavos)
		//this is used to prevent floating point number computation.
		Handlebars.registerHelper('toDecimal', function( value ) {
			return value / 100;
		});
		
		//helper
		Handlebars.registerHelper('bookingID', function(number) {
				if (typeof number == 'undefined') return 00000000;
				var str = number;
				var max = 8, pad = '0';				
				return str.length >= max ? str : new Array(max - str.length + 1).join(pad) + str;
		});
				
	};
	
	return {initialize: initialize};

});
