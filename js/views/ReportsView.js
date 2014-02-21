//boilerplate
define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'libs/jquery/jqueryui',	
	//collection & models
	'collections/reservations',	
	'collections/checkins',
	'collections/charges',
	//template
	'text!templates/reports.html',		
], function($, _, Backbone, Handlebars, $ui, ReservationCollection, CheckinCollection, ChargeCollection, txtTemplate) {

	var ReportsView = Backbone.View.extend({		
		tagName : 'div',
		initialize : function() {
			this.operation = 0;		//initial value, means no operation was chosen yet
		},
		render : function() {			
			var self = this;									
			var template = Handlebars.compile(txtTemplate);
			var html = template({});
			this.$el.html(html);
			$("#dFrom", this.$el).datepicker({ "changeMonth" : true, "changeYear": true, setDate : new Date()});
			$("#dTo", this.$el).datepicker({ "changeMonth" : true, "changeYear": true, setDate : new Date()});
			return this;
		},
		events : {
			'click button#btnReservations': 'showReservations',
			'click button#btnCheckins': 'showCheckins',
			'click button#btnCollections': 'showCollections',
			'click button#btnRoomUsage': 'showRoomUsage',
			'click button#btnRefresh': 'refresh',
			'click button#btnPrint': 'print',
		},
		showReservations : function() {		//show reservations
			$("#pReport").html('<h4>Showing Reservations</h4>');
			$("#dFrom", this.$el).focus();			
			this.operation = 1;
			this.selectButton();
			return false;
		},
		showCheckins : function() {		//show reservations
			$("#pReport").html('<h4>Showing Checkins</h4>');
			$("#dFrom", this.$el).focus();			
			this.operation = 2;
			this.selectButton();
			return false;
		},
		showCollections : function() {
			$("#pReport").html('<h4>Showing Payments Received</h4>');
			$("#dFrom", this.$el).focus();			
			this.operation = 3;
			this.selectButton();
			return false;
		},
		selectButton : function() {
			$("div#mainControls button").attr('class', 'btn');
			switch (this.operation) {
				case 1: $("button#btnReservations").addClass('btn-info'); break;
				case 2: $("button#btnCheckins").addClass('btn-info'); break;
				case 3: $("button#btnCollections").addClass('btn-info'); break;
			}
		},
		refresh : function() {
			if (this.operation == 0) {
				$("#pReport").html('<strong>Please choose a report to view first before clicking on the "View" or "Refresh" button.</strong>');
				return;
			}
			
			switch(this.operation) {
				case 1: this.generateReservations(); break; //reservations
				case 2: this.generateCheckins(); break; 	//checkins
				case 3: this.generateCollections(); break; 	//collections through charges payments
			}
			return false;
		},
		generateReservations : function() {			
			if (_.isEmpty($("#dFrom").val()) || _.isEmpty($("#dTo").val())) {
				alert('test');
				return;
			}
			$("#divReports").empty();
			var title = "", total = 0, count = 0;
			var collection = new CheckinCollection();
			collection.fetch({
				data : {'cinFrom' : $("#dFrom").val(), 'cinTo' : $("#dTo").val(), 'report' : 1, 'status' : 'RES'},
				wait : true,
				success : function(collection, response, options) {
					title = '<p><strong>Reservations from ' + $('#dFrom').val() + ' to ' + $('#dTo').val() + '</strong></p>';
					var html = title + "<table class='table table-striped table-hover table-bordered' width='100%'>";
					html += "<thead><tr>";
					html += "<th>Fullname</th>";
					html += "<th>Check In</th>";
					html += "<th>Check Out</th>";
					html += "<th>Room #</th>";
					html += "<th>Price</th>";
					html += "<th>Pax</th>";
					html += "<th>Children</th>";
					html += "<th>Deposit</th>";						
					html += "</tr></thead><tbody>";
					collection.each(function(res) {
						html += "<tr>";
						html += "<td>" + res.get('fullname') + "</td>";
						html += "<td>" + res.get('checkIn') + "</td>";
						html += "<td>" + res.get('checkOut') + "</td>";
						html += "<td>" + res.get('roomNo') + "</td>";
						html += "<td style='text-align: right;'>" + (res.get('roomPrice') / 100).formatMoney(2, '') + "</td>";
						html += "<td>" + res.get('pax') + "</td>";
						html += "<td>" + res.get('children') + "</td>";
						html += "<td style='text-align: right;'>" + (res.get('deposit') / 100).formatMoney(2, '') + "</td>";						
						html += "</tr>";						
						total += parseInt(res.get('deposit'));
						count += 1;
					});
						html += "<tr>";
						html += "<td colspan='7'>Total (" + count + " Records)</td>";												
						html += "<td style='text-align: right;'>" + (total / 100).formatMoney(2, '') + "</td>";						
						html += "</tr>";						
					html += "</tbody></table>";
					$("#divReports").append(html);
				},
				error : function(collection, response, options) {
					console.log(response);
				}
			});
		},
		generateCheckins : function() {			
			if (_.isEmpty($("#dFrom").val()) || _.isEmpty($("#dTo").val())) {				
				return;
			}
			$("#divReports").empty();
			var title = "", total = 0, count = 0;
			var collection = new CheckinCollection();
			collection.fetch({
				data : {'cinFrom' : $("#dFrom").val(), 'cinTo' : $("#dTo").val(), 'report' : 1, 'status' : 'IN'},
				wait : true,
				success : function(collection, response, options) {
					title = '<p><strong>Checked In from ' + $('#dFrom').val() + ' to ' + $('#dTo').val() + '</strong></p>';
					var html = title + "<table class='table table-striped table-hover table-bordered' width='100%'>";
					html += "<thead><tr>";
					html += "<th>Fullname</th>";
					html += "<th>Check In</th>";
					html += "<th>Check Out</th>";
					html += "<th>Room #</th>";
					html += "<th>Price</th>";
					html += "<th>Pax</th>";
					html += "<th>Children</th>";									
					html += "<th>Status</th>";									
					html += "</tr></thead><tbody>";
					collection.each(function(res) {
						html += "<tr>";
						html += "<td>" + res.get('fullname') + "</td>";
						html += "<td>" + res.get('checkIn') + "</td>";
						html += "<td>" + res.get('checkOut') + "</td>";
						html += "<td>" + res.get('roomNo') + "</td>";
						html += "<td style='text-align: right;'>" + (res.get('roomPrice') / 100).formatMoney(2, '') + "</td>";
						html += "<td>" + res.get('pax') + "</td>";
						html += "<td>" + res.get('children') + "</td>";
						html += "<td>" + res.get('status') + "</td>";
						html += "</tr>";			
						count ++;
					});
						html += "<tr>";
						html += "<td colspan='8'>Total (" + count + " Records)</td>";
						html += "</tr>";
					html += "</tbody></table>";
					$("#divReports").append(html);
				},
				error : function(collection, response, options) {
					alert('error');
				}
			});
		},
		generateCollections : function() {			
			if (_.isEmpty($("#dFrom").val()) || _.isEmpty($("#dTo").val())) {				
				return;
			}
			$("#divReports").empty();
			var title = "", total = 0, count = 0;
			var collection = new ChargeCollection();
			collection.comparator = function(c) {
				return c.get('date');
			};			
			collection.fetch({
				data : {'cinFrom' : $("#dFrom").val(), 'cinTo' : $("#dTo").val(), 'report' : 1},
				wait : true,
				success : function(collection, response, options) {
					collection.sort();
					title = '<p><strong>Payment(s) received from ' + $('#dFrom').val() + ' to ' + $('#dTo').val() + '</strong></p>';
					var html = title + "<table class='table table-striped table-hover table-bordered' width='100%'>";
					html += "<thead><tr>";
					html += "<th>Fullname</th>";
					html += "<th>Description</th>";
					html += "<th>Date</th>";
					html += "<th>Total</th>";								
					html += "</tr></thead><tbody>";
					collection.each(function(res) {
						html += "<tr>";
						html += "<td>" + res.get('fullname') + "</td>";
						html += "<td>" + res.get('description') + "</td>";
						html += "<td>" + res.get('date') + "</td>";
						html += "<td style='text-align: right;'>" + (res.get('amount') / 100).formatMoney(2, '') + "</td>";
						html += "</tr>";			
						count ++;
						total += parseInt(res.get('amount'));
					});
						html += "<tr>";
						html += "<td colspan='3'>Total (" + count + " Records)</td>";
						html += "<td style='text-align: right;'>" + (total / 100).formatMoney(2, '') + "</td>";
						html += "</tr>";
					html += "</tbody></table>";
					$("#divReports").append(html);
				},
				error : function(collection, response, options) {
					alert('error');
				}
			});
		},
		print : function() {
			var domain = document.domain;
			var w = window.open();
			var html = $("#divReports").html();
			var init = "<!DOCTYPE html>";
			init += "<html>";
			init += "<head><title>Room Accommodation and Reservation Sysstem</title><link type='text/css' href='http://" + domain + "/aman/res/bootstrap/css/bootstrap.css' rel='stylesheet' /></head>";
			init += "<body><div class='container' id='body'>" + html + "</div></body>";
			init += "</html>";
			$(w.document.body).append(init);
			w.print();
			return false;
		}
	});
	
	return ReportsView;

});
