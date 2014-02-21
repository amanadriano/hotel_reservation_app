//VIEW list of guests
define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	//collection of guest models (guest collection)
	'models/charge',
	//views
	'views/CheckinDetails',
	'views/ChargeDetail'
], function($, _, Backbone, Handlebars, ChargeModel, CheckinDetailsView, ChargeDetailView) {

	var ChargeListItemView = Backbone.View.extend({
		tagName: "tr",
		initialize : function(options) {
			var self = this;
			this.model = options.model;
			this.type = options.type;
			this.status = options.status;
		},
		render : function() {			
			var act = parseInt(this.model.get("action"));
			switch (act) {
				case 1: 
					$(this.el).attr("class","warning"); break;
				case 2:
					$(this.el).attr("class", "error"); break;
				case 3:
					$(this.el).attr("class", "success");
			}
			
			var fDate = new Date(this.model.get("date"));
			var displayDate = {
					date : (fDate.getMonth() + 1) + "/" + fDate.getDate() + "/" + fDate.getFullYear(),
					hour : fDate.getHours().toString().length > 1 ? fDate.getHours() : '0' + fDate.getHours(),
					minute : fDate.getMinutes().toString().length > 1 ? fDate.getMinutes() : '0' + fDate.getMinutes()
				};
										
			var html = "<td align='left'><a id='btnRemove' class='hide'><i class='icon-remove'></i></a> " + this.model.get("name") + "</td>";
			html += "<td align='left'>" + this.model.get("description") + "</td>";
			html += "<td align='center'>" + displayDate.date + " " + displayDate.hour + ":" + displayDate.minute + "</td>";
			html += "<td align='center'>" + this.model.get("qty") + "</td>";
			
			if (act == 2) {
				html += "<td align='right' style='text-align: right;'> -- </td>";
				html += "<td align='right' style='text-align: right;'> -- </td>";
			} else if (act == 3) {
				html += "<td align='right' style='text-align: right;'>" + (this.model.get("qty_cost") / 100).formatMoney(2, "") + "</td>";
				html += "<td align='right' style='text-align: right;'>(" + (this.model.get("amount") / 100).formatMoney(2, "") + ")</td>";
			} else {
				html += "<td align='right' style='text-align: right;'>" + (this.model.get("qty_cost") / 100).formatMoney(2, "") + "</td>";
				html += "<td align='right' style='text-align: right;'>" + (this.model.get("amount") / 100).formatMoney(2, "") + "</td>";
			}
			
			this.$el.html(html).css({ cursor : 'pointer' });
			return this;			
		},
		events : {
			"mouseover": "showRemoveButton",
			"mouseout": "hideRemoveButton",
			"click" : "showChargeInformation",
			"click #btnRemove" : "removeCharge"
		},
		showRemoveButton: function() {
			if (this.status == "OUT") return false; 
			if (this.forChoosing) return;
			$("#btnRemove", this.$el).show();
		},
		hideRemoveButton: function() {			
			$("#btnRemove", this.$el).hide();
		},
		showChargeInformation: function(event) {	
			if (event.srcElement.id == 'btnRemove') {
				this.removeCharge(event);
				return;
			}
			
			if (this.status == "OUT") return false; 
			//console.log(this.type);
			if (this.type == 1) return false;
			event.preventDefault();
			//this.trigger("checkinClick", this.model);
			var chargeView = new ChargeDetailView({ model : this.model });
			this.$el.hide();
			$(chargeView.render().el).insertAfter(this.el);
			var self = this;
			chargeView.on("cancelUpdate", function() {
				this.close();
				self.$el.show();
			});	
			chargeView.on("chargeUpdate", function() {
				this.close();
				self.render();
				self.$el.show();
				self.trigger("updateCharge");
			});			
			return false;			
		},
		removeCharge : function() {
			if (this.status == "OUT") return false; 
			if (!confirm("Delete this charge?")) return false;
			var self = this;
			this.model.destroy({
				success : function(model, response) {
					self.$el.fadeOut(function() {
						self.trigger("updateCharge");
					});
				}
			});
			return false;
		},
		onClose : function() {			
		}
	});
	
	return ChargeListItemView;

});
