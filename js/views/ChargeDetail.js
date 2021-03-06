//boilerplate
define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'libs/jquery/jqueryui',
	'libs/DateTimePicker/DateTimePicker',
	//models
	'models/charge',
	//templates
	'text!templates/charge.html'
], function($, _, Backbone, Handlebars, $ui, DTPicker, ChargeModel, txtTemplate) {	
	var ChargeDetailView = Backbone.View.extend ({
		tagName : "tr",
		op : "update",
		initialize : function(options) {
			this.model = options.model;
			if (options.op !== undefined) this.op = options.op;
	
			this.model.on("invalid", function(model, error) {
				$("#status", self.$el).attr("class", "alert alert-error").html(error);
			});
			
		},
		render : function() {			
			var template = Handlebars.compile(txtTemplate);
			var html = template(this.model.toJSON());
			this.$el.html(html);
			var self = this;
			$("#date", this.$el).datetimepicker({"changeMonth" : true, "changeYear": true});
			$("#name", this.$el).focus();
			if (this.op != 'new') $("select#action", self.$el).attr("disabled", "disabled");
			return this;
		},
		events : {
			"click #btnCancel" : "cancelUpdate",
			"click #btnSave": "updateCharge",
			"change #qty" : "updateCosts",
			"change #qty_cost" : "updateCosts",
			"change #amount" : "updateCosts",
			"change #name" : "checkName"
		}, 
		updateCosts : function() {
			var qty = $("#qty", this.$el).val();
			var qty_cost = $("#qty_cost", this.$el).val() * 100;
			var amount = $("#amount", this.$el).val() * 100;
			
			amount = qty * qty_cost;
			$("#amount", this.$el).val(amount / 100);
			return false;
		},
		cancelUpdate : function() {
			this.trigger("cancelUpdate");
			return false;
		},
		updateCharge : function(event) {
			if (this.op == 'new') {
				return this.addCharge(event);
			}
			event.preventDefault();
			var self = this;
			this.model.save({
					name : $("#name", self.$el).val(),
					description : $("#description", self.$el).val(),
					name : $("#name", self.$el).val(),
					date : $("#date", self.$el).val(),
					qty : $("#qty", self.$el).val(),					
					qty_cost : $("#qty_cost", self.$el).val() * 100,
					amount : $("#amount", self.$el).val() * 100,
					action : $("#action", self.$el).val()
				},{
				success : function(model, response) {
					self.trigger("chargeUpdate");					
				}
			});
			return false;
		},
		addCharge : function(event) {
			event.preventDefault();
			//save/add/insert this charge
			var self = this;
			this.model.save({
					name : $("#name", self.$el).val(),
					description : $("#description", self.$el).val(),
					date : $("#date", self.$el).val(),
					qty : $("#qty", self.$el).val(),					
					qty_cost : $("#qty_cost", self.$el).val() * 100,
					amount : $("#amount", self.$el).val() * 100,
					action : $("#action", self.$el).val()
				},{
				success : function(model, response) {
					self.trigger("saveUpdate");
				}, 
				error : function(model, response) {
					$("div#newChargeHolder div#status").attr("class", "alert alert-error").html(response);
				}
			});			
			return false;
		},
		checkName : function() { 
			var n = $("#name", this.$el).val();
			if (n.toUpperCase() != 'PAYMENT' && n.toUpperCase() != 'DEPOSIT') {
				$("#action", this.$el).removeAttr("disabled");
				return false;
			}
			$("#action option[value='3']", this.$el).attr({"selected": "selected", "disabled" : "disabled"});
			$("#action", this.$el).attr({"disabled" : "disabled"});
			return false;
		}
		
	});

	return ChargeDetailView;

});
