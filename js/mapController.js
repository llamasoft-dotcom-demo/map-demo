angular.module('mapApp', []).controller('MapController', function($scope, $http, $filter, $window) {
	var controller = this;

	controller.init = function() {
	    controller.seletedAirports = [];
		controller.airports = _.sortBy($window.init.sites, 'Code');;
		controller.options = _.map(controller.airports, function(airport){ 
		      return { name : airport.Code, value : airport}; 
		    });
		controller.airport = null;
	};

	controller.airportSelected = function() {
	    var latLng = new google.maps.LatLng(controller.airport.Latitude, controller.airport.Longitude);
	
	    
	    if (_.findWhere(controller.seletedAirports, controller.airport) == null) {
	        
	        var marker = new google.maps.Marker({
	            position: latLng,
	            map: controller.map,
	            icon : {
	                url : "https://ipsumimage.appspot.com/40x20?f=ffffff&b=000000&s=15&t=png&l="+controller.airport.Code
	            },
	            title: controller.airport.Code
	        });	 
	        
	        marker.addListener('click', function() {
	            controller.activeMarker = this;
	            controller.airport = _.findWhere(controller.airports, {Code: this.title});
	            // update the UI
	            $scope.$apply();
	        });
	        controller.seletedAirports.push(controller.airport);
        }
        controller.map.panTo(latLng);
        controller.activeMarker = null;
	};
	
   controller.initGoogleMap = function(map) {
       controller.map = map;
    };
	
    controller.deleteMarker = function() {
        controller.activeMarker.setMap(null);
        controller.activeMarker = null;
    };
     
	controller.init();
});