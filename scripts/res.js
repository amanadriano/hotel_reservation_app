$(function() {

	function cTemplate(id) {
		var source   = $("#" + id + "-template").html();
		var template = Handlebars.compile(source);
		return template;
	}	

	Backbone.emulateHTTP = true;
	Backbone.emulateJSON = true;

	//main view
	window.MainView = Backbone.View.extend ({
		el : $("div#main"),
		initialize : function(options) {
			this.render();
		},
		render : function() {
			return this;
		},
		showView : function(options) {			
			this.$el.html(options.view.render().html());
		}
	});

	window.Guest = Backbone.Model.extend ({
		defaults : {
			fullname : "",
			citizenship : "",
			dob : "",
			contact_no : "",
			email : "",
			company : "",
			position : ""
		},		
		url : "php/model.guest.php"
	});

	window.Guests = Backbone.Collection.extend ({
		model : Guest
	});

	//form for detail view update/create a guest
	window.FrmGuestView = Backbone.View.extend ({
		tagName : "div",
		template : null,
		initialize : function(option) {			
			this.template = cTemplate("FrmGuestView");
			this.render();			
		},
		render : function() {			
			$(this.el).html(this.template(this.model.toJSON()));			
			$("div#main").append(this.el);			
			return this;
		},
		events : {
			"click button#btnClear": "clearForm",
			"click button#btnSave": "saveRecord",
			"click button#btnClose": "closeForm"
		},
		clearForm : function() {
			$("input", this.el).each(function(index) {
				$(this).val("");
			});
			$("input:first", this.el).focus();
		},
		saveRecord : function() {
			//save model to database
			this.model.set("fullname", $("#fullname", this.el).val());
			this.model.save(null, {
					success : function(model, response, options) {
						console.log(JSON.stringify(model));
					}
				});
			return false;
		},
		closeForm : function() {
			console.log(this.model.get("id"));
		}
	});

	//view list of guests
	window.GuestListView = Backbone.View.extend ({
		el : $("#main"),
		tagName : "ul",
		template : null,		
		initialize : function(options) {
			this.template = cTemplate("GuestListView");
			this.collection = options.collection;			
			this.render();
		},
		render : function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}
	});

	//view list item of guests
	window.GuestListItemView = Backbone.View.extend ({
		tagName : "li",
		model : Guest,
		tamplate : null,
		initialize : function(options) {			
			this.render();
		},
		render : function() {
			$(this.el).html(this.template(this.model.toJSON()));
			return this;
		}
	});

	var guest = new Guest({fullname : "aman adriano", citizenship : "filipino", dob : "12/2/1981", contact_no : "09184030903",
					email : "amanadriano@yahoo.com", company : "secondrnd round", "position" : "programmer"
				});
	//var gView = new FrmGuestView({model : new Guest()});
	var gc = new Guests();
	gc.add(guest);
	var v = new GuestListView({"collection": gc, "model": guest});
	
	//var main = new MainView();
	//main.showView({"view": v});

})
