//boilerplate
define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'libs/jquery/jqueryui',
	'libs/DateTimePicker/DateTimePicker',
	//model & collection
	'models/checkin',
	'collections/rooms', 
	//template
	'text!templates/checkinForm.html',
	//views
	'views/GuestList'
], function($, _, Backbone, Handlebars, $ui, dtpicker, CheckinModel, RoomsCollection, txtTemplate, GuestListView) {
	
	var CheckinDetailView = Backbone.View.extend({		
		initialize : function(options) {			
			this.model = options.model;
			this.rooms = new RoomsCollection();
			this.op = 'new';
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
			$("#checkIn", this.$el).datetimepicker({
					"changeMonth" : true, "changeYear": true, showButtonPanel : true,
					//~ onSelect: function(date, obj) {						
						//~ self.model.set({checkIn : date},{silent : true});
					//~ }
				});
			$("#checkOut", this.$el).datetimepicker({"changeMonth" : true, "changeYear": true,
					//~ onSelect: function(date, obj) {
						//~ self.model.set({checkOut : date},{silent : true});
					//~ }
				});
			if (this.op == 'update') {
				$("button#btnCheckin", this.$el).hide();
				$("button#btnRefresh", this.$el).hide();
				$("#room", this.$el).hide();
				$("#roomPriceDiv", this.$el).show();
				$("button#btnUpdate", this.$el).show();
				$("div#roomPrice", this.$el).show();
				$("div#roomInfo", this.$el).hide();
			}
			return this;	
		},
		events : {
			"click button#btnCancel" : "cancelCheckin",
			"click button#btnCheckin" : "checkinGuest",
			"click button#btnChooseGuest" : "chooseGuest",
			"click button#btnRefresh" : "checkAvailability",
			"click select#room" : "showRoomInformation",
			"change select#room" : "showRoomInformation",
			"click button#btnUpdate" : "updateCheckin"
		},
		cancelCheckin : function(event) {
			//event.preventDefault();
			this.trigger("closeCheckin");
			//this.onClose();
			return false;
		},
		checkinGuest : function(event) {
			event.preventDefault();
			var self = this;
			var today = new Date();
			this.model.save({
					checkIn : $("#checkIn").val(),
					checkOut : $("#checkOut").val(),
					pax : $("#pax").val(),
					children : $("#children").val(),
					roomPrice : $("#price").val() * 100,
					status : "IN"
				},{
				success : function(model, response, options) {
					//console.log(model);
					self.trigger("guestCheckedIn", model);
					self.close();
				}, error : function(model, response, options) {
					$("#status", self.$el).attr("class", "alert alert-error").html(response);
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
				$("#fullname").val(event.get("fullname"));				
				this.guestListView.close();
				self.onClose();
			}, this);
			
			//show ui
			$("#modalDiv .modal-body").html(this.guestListView.el);
			$(".modal-backdrop").fadeIn("fast");
			$("#modalDiv").css({"margin": "-250px 0px 0px -350px", "width": "700px", "height": "500px", "overflow": "auto"}).show();			
			$("h3#modalLabel").html("Choose Guest");
			var self = this;
			$("button#btnModalClose").click(function() {					
					self.guestListView.close();
					self.onClose();
				});
			return false;
		},
		checkAvailability : function() {
			$("select#room").html("");
			if (($.trim($("#checkIn").val()) == "" ) || ($.trim($("#checkOut").val()) == "")) {
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
			var html = "<dl><dt>Room Type :</dt><dd>" + room.get("roomType") + "</dd>";
			html += "<dt>Room Description :</dt><dd>" + room.get("description") + "</dd>";
			html += "<dt>Room Cost :</dt><dd><input type='text' class='span2' id='price' value='" + (room.get("price") / 100) + "'/></dd></dl>";			
			$("#room-information").html(html);
			//set check in room price to currently selected room's price (default price)
			this.model.set({roomId : room.get("id"), roomNo : room.get("roomNo"), roomPrice : room.get("price")}, {silent: true});
			return false;
		},
		updateCheckin : function(event) {
			event.preventDefault();
			//update record
			var self = this;
			this.model.save({
					"roomPrice" : $("#roomPrice").val() * 100,
					"checkIn" : $("#checkIn").val(),
					"checkOut" : $("#checkOut").val(),
					"pax" : $("#pax").val(),
					"children" : $("#children").val()
				}, {
				success : function(model, response) {
					self.trigger("updateCheckin");
				}
			});
			return false;
		},
		onClose: function() {			
			$("div#modalDiv").hide();
			$("div#modalBackdrop").fadeOut("fast");
		}
	});
	
	return CheckinDetailView;

});
