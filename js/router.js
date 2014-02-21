define([
	'jquery', 'underscore', 'backbone',
	'views/GuestList', 'views/CheckinList', 'views/ReservationList', 'views/RoomList', 'views/ReportsView', 'views/UsersList',
	'views/LoginView'
], function($, _, Backbone, GuestListView, CheckinListView, ReservationListView, RoomListView, ReportsView, UsersView, LoginView) {
	
	var AppRouter = Backbone.Router.extend({
		routes : {
			'guests': 'showGuests',
			'checkins': 'showCheckins',
			'reservations': 'showReservations',
			'rooms': 'showRooms',
			'reports': 'showReports',
			'users': 'showUsers',
			'logout': 'logOut',
			//default
			'*actions': 'defaultAction'
		},
		initialize : function() {
			this.currentView = 0;
		},
		//function for removing current view from DOM and remove its events bindings (hopefully)		
		removeCurrentView : function() {
			if (this.currentView) {				
				this.currentView.close();
			}
		},
		switchTabs : function(id) {	//for switching tabs
			$("li.active").attr("class","");
			$("a#" + id).closest("li").attr("class","active");
		}
	});

	var initialize = function() {
		var appRouter = new AppRouter();				

		appRouter.on('route:showGuests', function() {
			this.removeCurrentView();			
			this.currentView = new GuestListView();
			this.currentView.render();
			this.switchTabs('navGuests');
			$("#main-content").html(this.currentView.el);
		});
		
		appRouter.on('route:showCheckins', function() {
			this.removeCurrentView();			
			this.currentView = new CheckinListView();
			this.currentView.render();
			this.switchTabs('navCheckins');
			$("#main-content").html(this.currentView.el);
		});

		appRouter.on('route:showReservations', function() {
			this.removeCurrentView();			
			this.currentView = new ReservationListView();
			this.currentView.render();
			this.switchTabs('navReservations');
			$("#main-content").html(this.currentView.el);
		});

		appRouter.on('route:showRooms', function() {
			this.removeCurrentView();			
			this.currentView = new RoomListView();
			this.currentView.render();
			this.switchTabs('navRooms');
			$("#main-content").html(this.currentView.el);
		});
		
		appRouter.on('route:showReports', function() {
			this.removeCurrentView();			
			this.currentView = new ReportsView();
			this.currentView.render();
			this.switchTabs('navReports');
			$("#main-content").html(this.currentView.el);
		});
		
		appRouter.on('route:showUsers', function() {
			this.removeCurrentView();			
			this.currentView = new UsersView();
			this.currentView.render();
			this.switchTabs('navUsers');
			$("#main-content").html(this.currentView.el);
		});
		
		appRouter.on('route:logOut', function() {
			this.removeCurrentView();
			this.switchTabs('navLogout');			
			$.post('php/logOut.php', function (data) {															
				$("#greet").html("<p class='label label-info'>Please log in first. Thank you.</p>");
				$("a#navLogout").html("Log In");
				window.location.replace('#');									
			});			
		});


		appRouter.on('route:defaultAction', function(actions) {
			this.removeCurrentView();			
			this.currentView = new LoginView();
			this.currentView.render();
			$("#main-content").html(this.currentView.el);
			$('#username', this.currentView.$el).focus();
		});
		
		Backbone.history.start();
	}

	return {
		initialize: initialize
	};
});
