angular.module('mapApp', []).controller('MapController', function($scope, $http, $filter, $window) {
	var controller = this;


	controller.init = function() {
		controller.airports = [];
		controller.airport = {
		        code : "TEST"
		}
	};

	controller.select = function() {
		
	};
	
	controller.init();
});