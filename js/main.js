require.config({
	paths : {
		jquery: "libs/jquery/jquery",
		underscore: "libs/underscore/underscore",
		backbone: "libs/backbone/backbone",
		handlebars: "libs/handlebars/handlebars",
		router: "router",
		dtpicker : 'libs/DateTimePicker/DateTimePicker'
	},
	shim: {
		underscore : {
			exports : '_'
		},
		backbone : {
			deps : ['underscore', 'jquery'],
			exports : "Backbone"
		},
        handlebars: {
            exports: 'Handlebars'
        },
        dtpicker : 'DTPicker'
    }
});

require (['app'],
function(App) {
	
	//prototype for formatting currency..................
	Number.prototype.formatMoney = function(places, symbol, thousand, decimal) {
		places = !isNaN(places = Math.abs(places)) ? places : 2;
		symbol = symbol !== undefined ? symbol : "Php ";
		thousand = thousand || ",";
		decimal = decimal || ".";
		var number = this, 
			negative = number < 0 ? "-" : "",
			i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
			j = (j = i.length) > 3 ? j % 3 : 0;
		return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
	};
	//================================================================
	
	//set helper for handlebars
	
	//ajax error handlers for http errors
	$.ajaxSetup({
		statusCode: {
			401: function(){
				// Redirec the to the login page.
				window.location.replace('#');				
				if (typeof $('#warn') !== 'undefined') $('#warn').remove();
				$("<p class='alert alert-warning' id='warn'>you are not logged in.</p>").appendTo("#greet").show().delay(3000).fadeOut();
			},
			403: function() {
				// 403 -- Access denied				
				if (typeof $('#warn') !== 'undefined') $('#warn').remove();
				$("<p class='alert alert-warning' id='warn'>This function is not available to your access level. Sorry.</p>").appendTo("#greet").show().delay(3000).fadeOut();
			}
		}
	});

	App.initialize();	
});
