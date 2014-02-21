//boilerplate
define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'libs/jquery/jqueryui',
	//collection of guest models (guest collection)
	'models/guest',	
	//template for guest list
	'text!templates/guest.html'	
], function($, _, Backbone, Handlebars, $ui, GuestModel, txtTemplate) {
	var GuestDetailsView = Backbone.View.extend({		
		//el: $("#modalDiv .modal-body"),
		initialize: function(options) {
			var self = this;			
						
			if (!_.isUndefined(options.model)) {	//if an ID was passed, fetch the guest record from the database
				this.model = options.model;
				this.render();
			} else {
				self.render();
			}
			this.model.on("error", function(model, error) {
				$("#status", self.$el).attr("class", "alert alert-error").html(error);
			});						
		},
		render: function() {			
			//set template using handlebars (todo)
			var template = Handlebars.compile(txtTemplate);
			var html = template(this.model.toJSON());
			this.$el.html(html);
			$("#fullname").focus();
			$("input#dob").datepicker({"changeMonth" : true, "changeYear" : true, "yearRange" : "-150:+0"});
			//show ui
			$(".modal-backdrop").fadeIn("fast");
			$("#modalDiv").css({"margin": "-190px 0px 0px -350px", "width": "700px", "height": "380"}).show();
			$("h3#modalLabel").html("Guest&#39;s Information");
			var self = this;
			$("button#btnModalClose").click(function() {				
				self.close();
			});
			return this;
		},
		//events
		events : {
			"click button#btnSave" : "updateGuest",
			"click button#btnClear": "clearGuest"			
		},
		updateGuest: function(event) {	//updates or saves existing/new guest record
			event.preventDefault();		
			var self = this;
			this.model.save({
				"fullname": $("#fullname").val(),
				"citizenship": $("#citizenship").val(),
				"dob": $("#dob").val(),
				"contact_no": $("#contact_no").val(),
				"email": $("#email").val(),
				"company": $("#company").val(),
				"position": $("#position").val()
			},{
				"success": function(model, response) {					
					$("#status", self.$el).attr("class", "alert alert-success").html("Guest information was saved.");
					self.trigger('formSubmitted', model);					
					self.close();
				},
				"error": function(model, response) {
					$("#status", self.$el).attr("class", "alert alert-error").html(response);					
				}
			});			
			return false;
		},
		clearGuest: function() {
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
	
	return GuestDetailsView;

});
