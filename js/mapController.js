angular.module('mapApp', []).controller('MapController', function($scope, $http, $filter, $window) {
	var controller = this;


	controller.init = function() {
		controller.airports = $window.init.sites;
		controller.options = _.map(controller.airports, function(airport){ 
		      return { name : airport.Code, value : airport}; 
		    });
		controller.airport = controller.airports[0];
	};

	controller.airportSelected = function() {
		alert(controller.airport.Code);
	};
	
	controller.init();
});