//boilerplate
define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'libs/jquery/jqueryui',
	//model & collection
	'models/checkin',
	'models/charge',
	'collections/charges',
	'models/guest',
	//template
	'text!templates/checkinInfo.html',
	//views
	'views/ChargeListItem',
	'views/ChargeDetail',
	'views/CheckinDetails',
	'views/GuestDetails'
], function($, _, Backbone, Handlebars, $ui, CheckinModel, ChargeModel, ChargeCollection, GuestModel, txtTemplate, ChargeListItemView, ChargeDetailView, CheckinDetailView, GuestDetailsView) {
	var CheckinInfoView = Backbone.View.extend({
		initialize : function(options) {
			_.bindAll(this, 'checkVisibleTotal');
			$(window).scroll(this.checkVisibleTotal);			
			this.model = options.model;			
			this.totalCharges = 0.0;
			this.cutOff = {'hour' : 12, 'minute' : 00};	//cutoff time for checkout 12:00 PM (noon) default
			this.charges = new ChargeCollection();
			//fetch charges for this checkin
			this.refreshCharges();			
			this.visible = false;
			//for checking if this is a reservatino record
			this.RES = false;
			if (this.model.get('status') == 'RES') this.RES = true;
		},		
		render : function() {
			var template = Handlebars.compile(txtTemplate);
			var html = template(this.model.toJSON());
			this.$el.html(html);
			if (this.RES) {
				$("button#btnNewCharge", this.$el).html('Add Deposit <i class="icon-ok-sign"></i>');
				$("button#checkout", this.$el).html('Check In <i class="icon-lock"></i>');
				$("h3#folioTitle", this.$el).html('Reservation Record');
			}
			return this;
		},
		events : {
			"click button#close": "closeView",
			"click button#btnNewCharge": "addCharge",
			"click button#checkout": "checkOut",
			"click button#update": "updateCheckin",
			"click button#btnRefreshCharges" : "refreshCharges",
			"click button#delete" : "deleteCheckin",
			"click button#print" : "print",
			"click a#guest" : "viewGuestInformation"
		},
		closeView : function() {
			this.trigger("closeCheckinInfo");
			this.close();
			return false;
		},
		renderCharges : function() {
			if (this.model.get("status") == "OUT") this.guestIsOut();						
			this.totalCharges = 0.0;
			var self = this;
			var recurr = new ChargeCollection();
			this.ch = new ChargeCollection();			
			$("table#chargesTable tbody", this.$el).empty();
			this.charges.each(function(charge) {
				if (recurr.length > 0 && !self.RES) {	//only show recurring charges if current record is a reservation
					var initdate = new Date(recurr.at(0).get("date"));
					var lastdate = new Date(charge.get("date"));										
					//initdate.setHours(self.cutOff.hour, self.cutOff.minute, 0, 0);	//set time of recurring charges to cutoff time
										
					while (initdate.getTime() < lastdate.getTime()) {						
						recurr.each(function(c) {
							//update all dates of recurr model to lastdate
							var day = initdate.getDate();
							var month = initdate.getMonth() + 1;
							var year = initdate.getFullYear();
							//c.set({ date : month + "/" + day + "/" + year + " " + initdate.getHours() + ":" + initdate.getMinutes() });
							c.set({ date : month + "/" + day + "/" + year + " " + self.cutOff.hour + ":" + self.cutOff.minute });
							self.addListItemShow(c, 1);	
						});
						//add 1 day to to initdate
						initdate.setDate(initdate.getDate()+1);
					}
					//update all dates of recurr model to lastdate
					var day = initdate.getDate();
					var month = initdate.getMonth() + 1;
					var year = initdate.getFullYear();
					recurr.each(function(c) {						
						c.set({ date : month + "/" + day + "/" + year + " " + self.cutOff.hour + ":" + self.cutOff.minute });
					});
				}
								
				if (charge.get("action") == "1") {				//recurring charge		
					var update = false;
					//moved the charge date for recurring charge +1 day, to reflect correct dates on FOLIO of guest
					var chargeDate = new Date(charge.get('date'));					
					chargeDate.setDate(chargeDate.getDate() + 1);
					charge.set('date', chargeDate.toString());															
					//=================================
					recurr.every(function(c) {
						if (charge.get("name") == c.get("name")) {							
							c.set({qty : c.get("qty") + charge.get("qty")});
							c.set({amount : c.get("amount") + charge.get("amount")});
							update = true;
							return false;							
						} 
					});
					if (!update) {						
						recurr.add(charge);
					}
				} else if (charge.get("action") == "2") {		//normal charge (one time charge only) - and return charges. for stopping recurring charges
					recurr.each(function(c) {
						if (charge.get("name") == c.get("name")) {	
							c.set({qty : c.get("qty") - charge.get("qty")});
							c.set({amount : c.get("amount") - charge.get("amount")});
							if(c.get("qty") < 1) recurr.remove(c);
						}
					});					
					self.addListItemShow(charge);
				} else if (charge.get("action") == "3") {			//payment recieved					
					self.addListItemShow(charge);
				} else {
					self.addListItemShow(charge);
				}
										
			});
			
				//check for current cutOff({hour, minute}) if we should include the current day
				if (recurr.length > 0 && !self.RES) {					
					var initdate = new Date(recurr.at(0).get("date"));
					var lastdate = new Date();	//get current date
					var outDate = new Date(this.model.get("checkOut"));	//checkout date
					initdate.setHours(self.cutOff.hour, self.cutOff.minute, 0, 0);										
					if (this.model.get("status") == "OUT") {
						lastdate = outDate;
					} else {	//this is an active checkin data
						var cutOffPassed = false;
						if (lastdate.getHours() > this.cutOff.hour) {
							cutOffPassed = true;							
						} else if (lastdate.getHours() == this.cutOff.hour) {
							if (lastdate.getMinutes() > this.cutOff.minute) cutOffPassed = true;							
						}
						
						if (cutOffPassed) {
							lastdate.setDate(lastdate.getDate() + 1);
						}									
					}
					//console.log(initdate);					
					//algo for compensating future dated recurring charges caused by adding 1 day to the starting date of recurring charges
					//to display these recurring charges as being dated day after the actual date of aquisition 
					//e.g. (1/1/2013 - xtra pax/pillow, shown as 1/2/2013 @ 12:00 PM)
					if (initdate.getTime() > lastdate.getTime()) {
						lastdate = new Date(initdate.getTime());
					}
					
					while (initdate.getTime() <= lastdate.getTime()) {								
						//update all dates of recurr model to lastdate												
						recurr.each(function(c) {											
							c.set("date", initdate.toString());
							self.addListItemShow(c, 1);
						});
						//add 1 day to to initdate
						initdate.setDate(initdate.getDate()+1);
					}
				}
							
			//print total charges		
			var myTotal = this.totalCharges / 100;
			$('#totalAmount').html(myTotal.formatMoney());
			$('#footer #totalAmount').html(myTotal.formatMoney());
			//console.log($('#footer #totalAmount').html());
		},
		addListItemShow : function(charge, type) {
			//console.log(charge.toJSON());
			var t = 0;
			if (typeof type != 'undefined') {
				t = type;
			} else {
				t = 0;
			}
			//entry to show to the user ===============================
			//create list item VIEW for each charge so we can control each item
			//set format, compute total, set events for each item.
			var str = charge.get("date");
			var d = new Date(charge.get("date"));
			//~ var d = new Date(str.substring(0, 4), parseInt(str.substring(5,7)) - 1, str.substring(8, 10), 0, 0, 0);
			var day = d.getDate();
			var month = d.getMonth() + 1;
			var year = d.getFullYear();
			if (t == 1) {
				charge.set("date", month + "/" + day + "/" + year + " " + this.cutOff.hour + ":" + this.cutOff.minute);
			} else {
				var displayDate = {
					date : (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear(),
					hour : d.getHours().toString().length > 1 ? d.getHours() : '0' + d.getHours(),
					minute : d.getMinutes().toString().length > 1 ? d.getMinutes() : '0' + d.getMinutes()
				};
				charge.set("date", displayDate.date + " " + displayDate.hour + ":" + displayDate.minute);				
			}
			this.ch.add(charge);
			var x = new ChargeListItemView({ model : charge, 'type' : t, status : this.model.get("status") });
			$("table#chargesTable tbody", this.$el).append(x.render().el);			
			//compute total charges
			var amount = charge.get("amount");
			if (charge.get('action') == 3) amount *= -1;
			this.totalCharges += parseInt(amount);
			var self = this;
			x.on("updateCharge", function() {
				self.refreshCharges();
			});
			//=========================================================
		},
		refreshCharges : function() {			
			var self = this;
			this.charges.fetch({
				data : { checkinId : self.model.id },
				"wait": true,
				"success": function(collection, response, options) {					
					console.log(collection);
					self.renderCharges();
				}
			});
			return false;
		},
		addCharge : function() {
			var self = this;
			if (this.nCharge !== undefined) return false;
			this.nCharge = new ChargeDetailView({ model : new ChargeModel({checkinId : self.model.get("id")}), op : 'new' });
			$("div#newChargeHolder table tbody", this.$el).append(self.nCharge.render().el);
			$("div#newChargeHolder").fadeIn();
			self.nCharge.on("cancelUpdate", function() {
				$("div#newChargeHolder").fadeOut(function() { 
					self.nCharge.close(); 
					delete self.nCharge;
				});				
			});
			
			self.nCharge.on("saveUpdate", function() {
				$("div#newChargeHolder").fadeOut(function() { 
					self.nCharge.close();
					delete self.nCharge;
					self.refreshCharges();
				});
			});
			
			return false;
		},
		checkOut : function(event) {
			if (this.RES) {
				this.checkIn();
				return false;
			}
			if (this.totalCharges > 0) {				
				$("div#checkinStatus", this.$el).stop(1, 1).html("Guest has a pending due of <strong>Php " + (this.totalCharges / 100).formatMoney(2, "") + "</strong>. Please settle it first before checking out.").fadeIn().delay(5000).fadeOut();
				return false;
			}
			//check out guest
			if (!confirm("Guest has no pending charges. Proceed with check out?")) return;
			//proceed with checkout
			var self = this;
			var d = new Date();
			var day = d.getDate();
			var month = d.getMonth() + 1;
			var year = d.getFullYear();
			this.model.save(
				{
					status: "OUT"	//, checkOut : month + "/" + day + "/" + year + " " + d.getHours() + ":" + d.getMinutes()
				}, {
				success : function(model, response) {
					self.guestIsOut();
					self.render();
					self.refreshCharges();
				},
				error : function(model, response) {
				}
			});
			return false;
		},
		guestIsOut : function() {
			$("button#checkout", this.$el).hide();
			$("button#btnNewCharge", this.$el).hide();
		},
		updateCheckin : function() {
			var self = this;
			var checkinDetailView = new CheckinDetailView({ model : this.model, op : 'update' });
			this.$el.hide();
			$('#main-content').append(checkinDetailView.render().el);			
			checkinDetailView.on("closeCheckin", function() {
				this.close();
				self.$el.show();
			});			
			checkinDetailView.on("updateCheckin", function() {
				this.close();
				self.render();
				self.refreshCharges();
				self.$el.show();	
			});
			return false;
		},
		deleteCheckin : function() { 
			if (!confirm("Remove checkin record?")) return false;
			var self = this;
			this.model.destroy({
				success : function(model, response) {
					self.trigger("closeCheckinInfo");
				}
			});
			return false;
		},
		print : function() {
			var domain = document.domain;
			var w = window.open();
			var html = $("#main-content").clone().find("button").remove().end().html();						
			var init = "<!DOCTYPE html>";
			init += "<html>";
			init += "<head><title>Checkin Information</title><link type='text/css' href='http://" + domain + "/aman/res/bootstrap/css/bootstrap.css' rel='stylesheet' /></head>";
			init += "<body><div class='container' id='body'>" + html + "</div></body>";
			init += "</html>";
			$(w.document.body).append(init);
			$("#footer", w.document.body).remove();
			w.print();
			return false;
		},
		isOnScreen : function(element) {
			var curPos = element.offset();
			var curTop = curPos.top;
			var scTop = $(document).scrollTop();
			var screenHeight = $(window).height();
			return (curTop > screenHeight + scTop) ? false : true;
		},
		checkVisibleTotal : function() {
			var visible = this.isOnScreen($('#rowTotal'));
			if (visible) {
				//$("#footer").fadeOut(200);
				$("#footer").slideUp();
			} else {
				$("#footer").slideDown();
			}
			this.visible = visible;
			return false;
		},
		viewGuestInformation : function(event) {
			event.preventDefault();			
			if (this.model.get('guestId') == 0) return false;
			var self = this;
			var guestModel = new GuestModel({id : this.model.get('guestId')});
			guestModel.fetch({ 
				wait : true ,
				success : function(model, response, options) {
					var guestDetailsView = new GuestDetailsView({model : guestModel});			
					guestDetailsView.on('formSubmitted', function() {				
						self.model.set('fullname', model.get('fullname'));
						self.render();
						guestDetailsView.close();
						guestDetailsView.onClose();
						$("#modalDiv").fadeOut();
						$(".modal-backdrop").fadeOut("fast");
					});						
					guestDetailsView.render();
					$("#modalDiv .modal-body").html(guestDetailsView.el);
					$(".modal-backdrop").fadeIn("fast");
					$("#modalDiv").css({"margin": "-200px 0px 0px -350px", "width": "700px", "height": "400px", "overflow": "auto"}).show();			
					$("h3#modalLabel").html("Guest Information");			
					$("button#btnModalClose").click(function() {										
						guestDetailsView.close();
						guestDetailsView.onClose();
						$("#modalDiv").fadeOut();
						$(".modal-backdrop").fadeOut("fast");
					});
				}
			});			
			return false;
		},
		checkIn : function() {
			if (!confirm("Proceed with check in?")) return false;
			var self = this;
			
			self.model.save({
					status : 'IN'
				},{
				success : function(model, response, options) {
					self.RES = false;
					self.render();
					self.refreshCharges();
					self.visible = false;
				}
			});
			return false;
		}
	});
	
	return CheckinInfoView;
});
