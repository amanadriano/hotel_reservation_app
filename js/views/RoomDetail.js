//boilerplate
define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'libs/jquery/jqueryui',
	//models
	'models/room',
	//templates
	'text!templates/room.html'
], function($, _, Backbone, Handlebars, $ui, RoomModel, txtTemplate) {	
	var RoomDetailView = Backbone.View.extend ({
		tagName : "tr",
		op : "update",
		initialize : function(options) {
			this.model = options.model;
			if (options.op !== undefined) this.op = options.op;
			this.model.on("invalid", function(model, error) {				
				$("#status").addClass("alert-error alert-error").html(error);
			});
			
		},
		render : function() {
			var template = Handlebars.compile(txtTemplate);
			var html = template(this.model.toJSON());
			this.$el.html(html);
			var self = this;
			$("#roomNo", this.$el).focus();
			return this;
		},
		events : {
			"click #btnCancel" : "cancelUpdate",
			"click #btnSave": "saveRoom"
		}, 
		cancelUpdate : function() {
			this.trigger("closeRoom");
			return false;
		},
		saveRoom : function(event) {
			event.preventDefault();
			//save/add/insert this charge
			var self = this;
			this.model.save({
					roomNo : $("#roomNo", self.$el).val(),
					roomType : $("#roomType", self.$el).val(),
					description : $("#description", self.$el).val(),
					price : $("#price", self.$el).val() * 100
				},{
				success : function(model, response) {
					self.trigger("saveRoom");
				}, 
				error : function(model, xhr, options) {					
					//var s = $.parseJSON(xhr.responseText);
					//$("#status").addClass("alert-error alert-error").html(s.msg);
					if (xhr.status == 403) {
						$("#status").addClass("alert alert-error").html("Error occured while saving room record. Please make sure you specify a unique room number.").show().delay(5000).fadeOut();
					}
				}
			});	
			return false;		
		}				
	});

	return RoomDetailView;

});
