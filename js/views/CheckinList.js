//boilerplate
define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'libs/jquery/jqueryui',
	//collection & models
	'collections/checkins',
	'models/checkin',
	//template
	'text!templates/checkins.html',
	//views
	'views/CheckinListItem',
	'views/CheckinDetails',
	'views/CheckinInfo'
], function($, _, Backbone, Handlebars, $ui, CheckinCollection, CheckinModel, txtTemplate, CheckinListViewItem, CheckinDetailView, CheckinInfoView) {

	var CheckinListView = Backbone.View.extend({
		//el: $('#main-content'),
		tagName : 'div',
		initialize : function() {
			this.collection = new CheckinCollection();
			this.collection.comparator = function(checkin) {
				return checkin.get("room");
			};
			//fetch checkins (active)	default to status = IN
			this.showList();
		},
		render : function() {
			var self = this;
			var template = Handlebars.compile(txtTemplate);
			var html = template({});
			this.$el.html(html);
			this.collection.sort();
			this.loadList();
			//set date pickers
			$("#cinFrom", this.$el).datepicker({ "changeMonth" : true, "changeYear": true, defaultDate : new Date() });
			$("#cinTo", this.$el).datepicker({ "changeMonth" : true, "changeYear": true, defaultDate : new Date() });				
			return this;
		},
		events : {
			"click button#btnNew": "newCheckin",
			"change #viewCheckins": "changeViewList",
			"click button#btnRefresh" : "refreshList",
			"click button#btnClearDates" : "clearFields"
		},
		newCheckin: function() {			
			var checkinModel = new CheckinModel();
			if (!_.isUndefined(this.checkinDetailView)) this.checkinDetailView.undelegateEvents();				
			this.checkinDetailView = new CheckinDetailView({model : checkinModel});
			this.checkinDetailView.render();
			//this.checkinDetailView.on("cancelCheckin", this.render, this);
			$('#main-content').append(this.checkinDetailView.el);
			this.$el.hide();
			var self = this;
			this.checkinDetailView.on('closeCheckin', function() {
					this.off("closeCheckin");
					this.close();
					self.render();
					self.$el.show();
				});

			this.checkinDetailView.on('guestCheckedIn', function(model) {
					this.off("guestCheckedIn");
					this.close();
					self.collection.add(checkinModel);
					self.render();
					self.$el.show();
				});
			return false;				
		},
		changeViewList : function(event) {
			this.showList();
			return false;
		},
		showList : function(args) {		
			var c_stat = "IN";
			var filter = {};							
			this.choice = $("#viewCheckins").val();
			if (this.choice == 1) {
				c_stat = "IN";
				$("#divFilter", this.$el).fadeOut();
			} else if (this.choice == 2) {
				c_stat = "OUT";
				$("#divFilter", this.$el).fadeIn();
				if (typeof args !== "undefined") {
					filter = args.filter;
				} else {
					var today = new Date();
					filter.cinFrom = (today.getMonth() + 1) + "/1/" + today.getFullYear();
					filter.cinTo = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
					$("#cinFrom").val(filter.cinFrom);
					$("#cinTo").val(filter.cinTo);
				}
			}
			filter.status = c_stat;
			
			var self = this;
			this.collection.fetch({
				data : filter,
				"wait": true,
				"success": function(collection, response, options) {
					self.loadList();
				}
			});										
		},
		refreshList : function(event) {
			//~ event.preventDefault();
			var filter = {};
			if (_.isEmpty($("#cinFrom").val()) || _.isEmpty($("#cinTo").val())) {
			} else {
				filter.cinFrom = $("#cinFrom").val();
				filter.cinTo = $("#cinTo").val();
			}
			
			if (!_.isEmpty($("#cinName"))) {
				filter.cinName = $("#cinName").val();
			}
			this.showList({"filter" : filter});
			return false;
		},
		loadList : function() {
			var self = this;
			//load list
			$("tbody", self.$el).empty();
			this.collection.each(function(checkin) {
				//create list item VIEW for each checkin record
				//include buttons/links/clickables for : 
				//viewing checkin details
				//delete checkin record
				//--- details view should offer : check out and/or delete record, CRUD charges for each guest
				var checkinListItem = new CheckinListViewItem({model : checkin});
				checkinListItem.on('checkinRemoved', function() {
						self.collection.remove(this.model);
						self.loadList();
					}, this);
				checkinListItem.on('checkinRecordChanged', function() {						
						self.loadList();
					}, this);
				checkinListItem.on("checkinClick", function(event) {										
						var checkinInfoView = new CheckinInfoView({model : event});
						$('#main-content').append(checkinInfoView.render().el);
						self.$el.hide();						
						checkinInfoView.on("closeCheckinInfo", function(event) {							
							checkinInfoView.close();
							self.refreshList(event);
							//self.loadList();
							self.$el.show();
						});
					}, this);
				$("tbody", self.$el).append(checkinListItem.render().el);
			});
		},
		clearFields : function(event) {
			event.preventDefault();
			$("#cinFrom").val("");
			$("#cinTo").val("");
			$("#cinName").val("");
			return false;
		},
		onClose : function() {
			if (this.checkinDetailView) {
				this.checkinDetailView.close();
			}
		}
	});
	
	return CheckinListView;

});
