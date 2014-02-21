//boilerplate
define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'libs/jquery/jqueryui',
	'libs/tipsy/jquery.tipsy',
	//collection & models
	'collections/reservations',
	'models/checkin',
	'collections/checkins',
	//template
	'text!templates/reservations.html',
	'text!templates/reservationInfoHover.html',
	//views
	'views/ReservationListItem',
	'views/ReservationDetails',
	'views/CheckinInfo'
], function($, _, Backbone, Handlebars, $ui, Tipsy, ReservationCollection, CheckinModel, CheckinCollection, txtTemplate, txtTemplateResInfo, ReservationListItem, ReservationDetailView, CheckinInfoView) {

	var ReservationListView = Backbone.View.extend({
		//el: $('#main-content'),
		tagName : 'div',
		initialize : function() {
			this.collection = new ReservationCollection();
			this.checkins = new CheckinCollection();
			//this.showList();
			this.maxDays = 22;		//set default value for number of days to show
			this.dateStart = new Date();
			this.dateStart.setHours(0, 0, 0, 0);
			
			this.dateEnd = new Date();
			this.dateEnd.setDate(this.dateStart.getDate() + this.maxDays);
			this.dateEnd.setHours(0, 0, 0, 0);
			//this.loadList();
			
			
			//var for setting date of room blockings
			this.dayOffset = 1;
			//colors of blockings
			this.blockColors = {IN : '#76B535', OUT : '#FF6A2E', RES : '#47B5FF'};
		},
		render : function() {			
			var self = this;									
			var template = Handlebars.compile(txtTemplate);
			var html = template({});
			this.$el.html(html);
			this.prepareTable();		//create the contents of thead and structure of tbody			
			//this.collection.sort();
			//this.showList();
			//this.loadList();
			//set date pickers
			$("#cinFrom", this.$el).datepicker({ "changeMonth" : true, "changeYear": true, setDate : new Date()});
			//$("#cinTo", this.$el).datepicker({ "changeMonth" : true, "changeYear": true});				
			return this;
		},
		events : {
			"click button#btnNew": "newReservation",
			//"change #viewCheckins": "changeViewList",
			"click button#btnRefresh" : "refreshList",
			"click button#btnToday" : "showToday",
			"click button#btnPrev" : "showPrevious",
			"click button#btnNext" : "showNext",
			"click button#btnPrint" : "print"
		},
		newReservation: function() {			
			var reservationModel = new CheckinModel();
			if (typeof this.reservationDetailView !== 'undefined') this.reservationDetailView.undelegateEvents();				
			this.reservationDetailView = new ReservationDetailView({model : reservationModel});
			this.reservationDetailView.render();
			$('#main-content').append(this.reservationDetailView.el);
			this.$el.hide();
			var self = this;
			this.reservationDetailView.on('closeReservation', function() {
					this.off("closeReservation");
					this.close();
					self.prepareTable();
					self.$el.show();
				});

			this.reservationDetailView.on('reservationSuccess', function(model) {
					this.off("reservationSuccess");
					this.close();
					self.collection.add(reservationModel);
					self.render();
					self.$el.show();
				});
			return false;
		},
		prepareTable : function() {
			$('table thead', this.$el).empty();
			
			var monthNames = new Array('JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER');
			
			var head = '';
			var cdate = new Date(this.dateStart.getTime());						
			var str = monthNames[this.dateStart.getMonth()] + " " + this.dateStart.getFullYear();			
			if (this.dateStart.getMonth() != this.dateEnd.getMonth() || this.dateStart.getFullYear() != this.dateEnd.getFullYear()) {
				str = monthNames[this.dateStart.getMonth()] + " " + this.dateStart.getFullYear() + " - " + monthNames[this.dateEnd.getMonth()] + "  " + this.dateEnd.getFullYear();
			}
			
			var perc = "4%";
			head = "<tr><th width='' align='center'></th><th style='text-align: center;' colspan='" + this.maxDays + "'>" + str + "</th>";
			head += '<tr><th width="" align="center">RM#</th>';
			for (a=0;a<this.maxDays;a++) {			
				var month = cdate.getMonth() + 1;
				var day = cdate.getDate();
				var year = cdate.getFullYear().toString().substring(2, cdate.getFullYear().length);					
				head += '<th width="' + perc + '"  style="text-align: center;"><span>' +  day + '</span></th>';
				cdate.setDate(cdate.getDate() + 1);
			}
			head += '</tr>';
			$('table thead', this.$el).append(head);
			
			var self = this;
			$.getJSON("php/getRooms.php", function(data, status, jqXHR) {
				$('table tbody', self.$el).empty();				
				$.each(data, function(index, value) {
					var html = "";					
					html = '<tr id="' + value.roomNo + '"><td width="10%">' + value.roomNo + '</td>';
					for (a=0;a<self.maxDays;a++) {
						html += '<td width="3%" style="padding: 0;"><div style="float: left; width: 50%; height: 36px;">&nbsp;</div><div style="float: right; width: 50%; height: 36px;">&nbsp;</div></td>';
					}					
					html += '</tr>';										
					$('table tbody', self.$el).append(html);					
				});
				self.loadList();
			});
		},		
		changeViewList : function(event) {
			this.showList();
			return false;
		},
		loadList : function(args) {		
			//~ var c_stat = "IN";
			var self = this;
			var month = this.dateStart.getMonth() + 1;
			var day = this.dateStart.getDate();
			var year = this.dateStart.getFullYear();			
			var from = month + "/" + day + "/" + year;			
			month = this.dateEnd.getMonth() + 1;
			day = this.dateEnd.getDate();
			year = this.dateEnd.getFullYear();
			var to = month + "/" + day + "/" + year;
			
			var filter = {cinFrom : from, cinTo : to};
			//~ this.collection.fetch({
				//~ data : filter,
				//~ "wait": true,
				//~ "success": function(collection, response, options) {					
					//~ self.collection = collection;
					//~ self.showList({
						//~ src : self.collection, 
						//~ css : {'background' : '#386DA2'}
					//~ });
				//~ }
			//~ });										
			
			
			filter.FOR_BLOCKINGS = 1;
			
			this.checkins.fetch({
				data : filter,
				"wait": true,
				"success": function(collection, response, options) {					
					self.checkins = collection;
					self.showList({						
						src : self.checkins,
						css : {'background' : '#FFCE00'}
					});
				}
			});
		},
		refreshList : function(event) {
			event.preventDefault();			
			if (_.isEmpty($("#cinFrom").val())) {
			} else {
				this.dateStart = new Date($("#cinFrom").val());
				this.dateStart.setHours(0, 0, 0, 0);				
				this.dateEnd = new Date(this.dateStart.toString());
				this.dateEnd.setDate(this.dateEnd.getDate() + this.maxDays);
			}
			this.prepareTable();
			return false;
		},
		showList : function(arg) {
			var self = this;
			var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
			var diffDays = 0;
			var counter = 0;			
					
			arg.src.each(function(res) {				
				counter = 0;
				markSD = new Date(res.get('checkIn'));
				markED = new Date(res.get('checkOut'));	
				markSD.setHours(0, 0, 0, 0);	
				markED.setHours(0, 0, 0, 0);	
				var showCheckin = false;
				var showCheckout = true;
				//~ console.log(markSD + " -------- " + self.dateStart);
				//~ console.log(self.getDays(markSD) + " -------- " + self.getDays(self.dateStart));
				
				if (self.getDays(markSD) < self.getDays(self.dateStart)) {					
					markSD = new Date(self.dateStart.getTime());					
					//~ console.log(self.getDays(markSD) + " --- " + self.getDays(markED));
				} else if (markSD.getTime() === self.dateStart.getTime()) {
					counter = 0;
					showCheckin = true;					
				} else {				
					showCheckin = true;	
					diffDays = markSD.getTime() - self.dateStart.getTime();									
					counter = Math.floor(diffDays/1000/60/60/24);			
					//console.log(Math.floor(diffDays/1000/60/60));															
				}								
				
				if (markED.getTime() > self.dateEnd.getTime()) {
					markED = new Date(self.dateEnd.getTime());				
					showCheckout = false;
				}
				
				//~ if (markSD.getTime() <= self.dateEnd.getTime() && markED.getTime() >= self.dateStart.getTime() && counter < self.maxDays) {
				if (self.getDays(markSD) <= self.getDays(self.dateEnd) && self.getDays(markED) >= self.getDays(self.dateStart) && counter < self.maxDays) {
					//while (Math.floor(markSD.getTime()/1000/60/60/24) <= Math.floor(markED.getTime()/1000/60/60/24)) {										
					var runDay = self.getDays(markSD);	//get no of days for starting day
					var endDay = self.getDays(markED);	//get no of days for ending day
					//~ console.log(runDay + " --- " + endDay);
					while (runDay <= endDay) {
						counter += 1;
						var td = $("tr#" + res.get("roomNo") + " td:eq(" + counter + ")", self.$el);												
						var template = Handlebars.compile(txtTemplateResInfo);
						var html = template(res.toJSON());
			
						if (showCheckin) {	//show the checkin date of this entry
							td = $("div:eq(1)", td);
							showCheckin = false;
						} else if (showCheckout && (self.getDays(markED) == runDay)) {	//show the cehckout date of this entry
							td = $("div:eq(0)", td);
							showCheckout = false;
						}
						
						$(td).tipsy({ html : true, fade : false});
															
						if (res.get('status') == 'RES') {														
							td.css('background', self.blockColors.RES).attr('title', html);
							td.click(function(event) {
								self.openReservation({model : res});
							});						
						} else {													
							if (res.get('status') == 'OUT') {
								td.css('background', self.blockColors.OUT).attr('title', html);
							} else {								
								td.css('background', self.blockColors.IN).attr('title', html);
							}
							td.click(function(event) {								
								self.openCheckin({model : res});
							});						
						}
																		
						runDay += 1;
					}
				}
					
					
			});
		},
		getDays : function(dateObj) {
			return Math.floor(dateObj.getTime()/1000/60/60/24);
			//~ return Math.round(dateObj.getTime()/1000/60/60/24);
			//~ return dateObj.getTime()/1000/60/60/24;
		},
		openReservation: function(arg) {			
			var reservation = arg.model;						
			if (typeof this.checkinInfoView !== 'undefined') this.checkinInfoView.undelegateEvents();				
			this.checkinInfoView = new CheckinInfoView({model : reservation});
			this.checkinInfoView.render();
			$('#main-content').append(this.checkinInfoView.el);
			this.$el.hide();
			var self = this; 
			this.checkinInfoView.on('closeCheckinInfo', function() {					
					self.checkinInfoView.close();
					self.prepareTable();
					self.$el.show();
				});
			
		},
		openCheckin: function(arg) {			
			var checkinModel = arg.model;
			if (typeof this.checkinInfoView !== 'undefined') this.checkinInfoView.undelegateEvents();				
			this.checkinInfoView = new CheckinInfoView({model : checkinModel});
			this.checkinInfoView.render();
			$('#main-content').append(this.checkinInfoView.el);
			this.$el.hide();
			var self = this; 
			this.checkinInfoView.on('closeCheckinInfo', function() {					
					//this.off("closeCheckinInfo");
					self.checkinInfoView.close();
					self.prepareTable();
					self.$el.show();
				});
				
				
		},
		showPrevious : function() { 
			this.dateStart.setDate(this.dateStart.getDate() - this.dayOffset);
			this.dateStart.setHours(0, 0, 0, 0);				
			this.dateEnd = new Date(this.dateStart.getTime());
			this.dateEnd.setDate(this.dateEnd.getDate() + this.maxDays);			
			this.prepareTable();
			return false;
		},
		showNext : function() { 
			this.dateStart.setDate(this.dateStart.getDate() + this.dayOffset);
			this.dateStart.setHours(0, 0, 0, 0);				
			this.dateEnd = new Date(this.dateStart.getTime());
			this.dateEnd.setDate(this.dateEnd.getDate() + this.maxDays);			
			this.prepareTable();
			return false;
		},
		showToday : function(event) {
			event.preventDefault();
			var d = new Date();
			$("#cinFrom").val((d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear());
			this.refreshList(event);
			return false;
		},
		print : function() {
			var domain = document.domain;
			var w = window.open();
			var html = $("table#blockings").clone().find("button").remove().end().html();						
			html = "<table class='table table-striped table-hover table-bordered' id='blockings'>" + html + "</table>";
			var init = "<!DOCTYPE html>";
			init += "<html>";
			init += "<head><title>Room Blockings (Reservations and Checkins)</title><link type='text/css' href='http://" + domain + "/aman/res/bootstrap/css/bootstrap.css' rel='stylesheet' /></head>";
			init += "<body><div class='container' id='body'>" + html + "</div></body>";
			init += "</html>";
			$(w.document.body).append(init);
			w.print();
			return false;
		},
		onClose : function() {
			if (this.checkinDetailView) {
				this.checkinDetailView.close();
			}
		}
	});
	
	return ReservationListView;

});
