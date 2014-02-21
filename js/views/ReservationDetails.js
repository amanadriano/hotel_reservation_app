//boilerplate
define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'libs/jquery/jqueryui',
	//model & collection
	'models/checkin',
	'collections/rooms',
	'models/checkin',
	'models/charge',
	'models/guest',
	//template
	'text!templates/reservationForm.html',
	//views
	'views/GuestList',
	'views/GuestDetails'
], function($, _, Backbone, Handlebars, $ui, ReservationModel, RoomsCollection, CheckinModel, ChargeModel, GuestModel, txtTemplate, GuestListView, GuestDetailsView) {
	
	var ReservationDetailView = Backbone.View.extend({		
		initialize : function(options) {			
			
			
			this.model = options.model;
			this.rooms = new RoomsCollection();
			this.op = 'new';
			var self = this;
			if (options.op !== undefined) this.op = options.op;
			this.model.on("invalid", function(model, error) {
				$("#status", self.$el).attr("class", "alert alert-error").html(error);
			});			
		},
		render : function() {
			var self = this;
			var template = Handlebars.compile(txtTemplate);
			var html = template(this.model.toJSON());
			this.$el.html(html);
			$("#checkIn", this.$el).datetimepicker({"changeMonth" : true, "changeYear": true});
			$("#checkOut", this.$el).datetimepicker({"changeMonth" : true, "changeYear": true});
			$("#depositDate", this.$el).datetimepicker({"changeMonth" : true, "changeYear": true});
			if (this.op == 'update') {
				$("button#btnSave", this.$el).hide();
				$("button#btnRefresh", this.$el).hide();
				$("#room", this.$el).hide();
				$("#roomPriceDiv", this.$el).show();
				$("button#btnUpdate", this.$el).show();
				$("button#btnDelete", this.$el).show();
				$("button#btnCheckin", this.$el).show();
				$("div#roomPrice", this.$el).show();
				$("div#roomInfo", this.$el).hide();
				$("#checkIn", this.$el).attr('disabled','disabled');
				$("#checkOut", this.$el).attr('disabled','disabled');
			} else {
				var cinDate = new Date();
				var displayDate = {
					date : (cinDate.getMonth() + 1) + "/" + cinDate.getDate() + "/" + cinDate.getFullYear(),
					hour : cinDate.getHours().toString().length > 1 ? cinDate.getHours() : '0' + cinDate.getHours(),
					minute : cinDate.getMinutes().toString().length > 1 ? cinDate.getMinutes() : '0' + cinDate.getMinutes()
				};
				$("#depositDate", this.$el).val(displayDate.date + " " + displayDate.hour + ":" + displayDate.minute);
			}
			return this;	
		},
		events : {
			"click button#btnCancel" : "closeReservation",
			"click button#btnModalClose" : "closeReservation",
			"click button#btnSave" : "saveReservation",
			"click button#btnChooseGuest" : "chooseGuest",
			"click button#btnRefresh" : "checkAvailability",
			"click select#room" : "showRoomInformation",
			"change select#room" : "showRoomInformation",
			"click button#btnUpdate" : "updateRecord",
			"click button#btnCheckin" : "checkIn",
			"click button#btnDelete" : "deleteReservation",
			"click button#btnViewGuest" : "viewGuestInformation"
		},
		closeReservation : function(event) {
			//event.preventDefault();
			this.trigger("closeReservation");
			//this.onClose();		
			return false;	
		},
		saveReservation : function(event) {
			event.preventDefault();
			var self = this;
			this.model.save({
					status : 'RES',
					checkIn : $("#checkIn").val(),
					checkOut : $("#checkOut").val(),
					pax : $("#pax").val(),
					children : $("#children").val(),
					roomPrice : $("#price").val() * 100,
					status : "RES",
					deposit : $("#deposit").val() * 100,
					depositDate : $("#depositDate").val()
				},{
				success : function(model, response, options) {
					//console.log(model);
					self.trigger("reservationSuccess", model);
					self.close();
				}
			});
			return false;
		},
		chooseGuest : function(event) {
			event.preventDefault();
			var self = this;
			this.guestListView = new GuestListView({forChoosing : true});
			this.guestListView.render();
			//attach event listener for guest list
			this.guestListView.on("guestSelected", function(event) {									
				self.model.set({guestId : event.get("id"), fullname : event.get("fullname")}, {silent: true});
				$("#fullname", self.$el).val(event.get("fullname"));				
				this.guestListView.close();
				$("#modalDiv").fadeOut();
				$(".modal-backdrop").fadeOut("fast");				
			}, this);
			
			//show ui
			$("#modalDiv .modal-body").html(this.guestListView.el);
			$(".modal-backdrop").fadeIn("fast");
			$("#modalDiv").css({"margin": "-300px 0px 0px -350px", "width": "700px", "height": "90%", "overflow": "auto"}).show();			
			$("h3#modalLabel").html("Choose Guest");			
			$("button#btnModalClose").click(function() {										
					self.guestListView.close();
					self.onClose();
					$("#modalDiv").fadeOut();
					$(".modal-backdrop").fadeOut("fast");
				});
			return false;
		},
		checkAvailability : function() {
			$("select#room").html("");
			if (($.trim($("#checkIn").val()) == "" ) || ($.trim($("#checkOut").val()) == "")) {
				$("#status", this.$el).attr("class", "alert alert-error").html("Please choose a checkin and checkout date first.");
				return false;
			}
			var self = this;
			$.getJSON('php/checkAvailability.php',
					{
						'checkinDate' : $("#checkIn").val(),
						'checkoutDate' : $("#checkOut").val()
					},
					function(data, txtStatus, jqXHR) {
						
						self.rooms = new RoomsCollection(data);
						self.refreshRoomList();
					}
			);
			return false;
		},
		refreshRoomList : function() {
			$("select#room").empty();
			this.rooms.each(function(room) {
				var html = "<option value='" + room.get("id") + "'>" + room.get("roomNo") + "</option>";
				$("select#room").append(html);
			});
			this.showRoomInformation();
			return false;
		},
		showRoomInformation : function() {			
			var room = this.rooms.get($("#room").val());			
			
			if (typeof room === 'undefined') {
				$("#room-information").html("");
				$("#status", self.$el).attr("class", "alert alert-error").html("No available rooms for the date you specified.");
				return;
			}
			
			var html = "<dl><dt>Room Type :</dt><dd>" + room.get("roomType") + "</dd>";
			html += "<dt>Room Description :</dt><dd>" + room.get("description") + "</dd>";
			html += "<dt>Room Cost :</dt><dd><input type='text' class='span2' id='price' value='" + room.get("price")/100 + "'/></dd></dl>";			
			$("#room-information").html(html);
			//set check in room price to currently selected room's price (default price)
			this.model.set({roomId : room.get("id"), roomNo : room.get("roomNo"), roomPrice : room.get("price")}, {silent: true});
			return false;
		},
		updateRecord : function(event) {
			event.preventDefault();
			//update record
			var self = this;
			this.model.save({
					"deposit" : $("#deposit").val() * 100,
					"depositDate" : $("#depositDate").val(),
					"roomPrice" : $("#roomPrice").val() * 100,
					"checkIn" : $("#checkIn").val(),
					"checkOut" : $("#checkOut").val(),
					"pax" : $("#pax").val(),
					"children" : $("#children").val()
				}, {
				success : function(model, response) {
					self.trigger("reservationSuccess");
				}
			});
			return false;
		},
		deleteReservation : function() {
			//delete reservation record from database
			if (!confirm("Delete this reservation?")) return false;
			var self = this;
			this.model.destroy({
				success : function(model, response) {					
					self.trigger("reservationSuccess");					
				}
			});
			return false;
		},
		checkIn : function() {
			//checkin this reservation record
			if (!confirm("Proceed with check in?")) return false;
			var checkinModel = new CheckinModel();
			var self = this;
			var cinDate = new Date(self.model.get('checkIn'));
			var displayDate = {
					date : (cinDate.getMonth() + 1) + "/" + cinDate.getDate() + "/" + cinDate.getFullYear(),
					hour : cinDate.getHours().toString().length > 1 ? cinDate.getHours() : '0' + cinDate.getHours(),
					minute : cinDate.getMinutes().toString().length > 1 ? cinDate.getMinutes() : '0' + cinDate.getMinutes()
				};
			
			checkinModel.save({
					guestId : self.model.get('guestId'),	//id of guest record
					fullname : self.model.get('fullname'),
					checkIn : displayDate.date + " " + displayDate.hour + ":" + displayDate.minute,
					checkOut : self.model.get('checkOut'),
					roomId : self.model.get('roomId'),
					roomNo : self.model.get('roomNo'),
					roomPrice : self.model.get('roomPrice'),
					status : 'IN',
					pax : self.model.get('pax'),
					children : self.model.get('children')
				},{
				success : function(model, response, options) {								
					self.trigger("reservationCheckedIn");					
				}
			});
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
		onClose: function() {			
		}
	});
	
	return ReservationDetailView;

});
