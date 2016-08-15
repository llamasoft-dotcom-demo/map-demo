angular.module('mapApp', []).controller('MapController', function($scope, $http, $filter, $window) {
	var controller = this;

	/**
	 * Method to initialize all fields
	 */
	controller.init = function() {
	    // holds the airport (codes) of the displayed airports
	    controller.seletedAirports = [];
	    
	    // list of all airports (sorted by code)
		controller.airports = _.sortBy($window.init.sites, 'Code');
		// clean up the names
		controller.airports = _.map(controller.airports, function(airport){ 
		    // remove the upper case part
		    var niceName = airport.FullSiteName.replace("AIRPORT_"+airport.Code+"_", "");
		    airport.FullSiteName = niceName;
            return airport; 
          });		
		
		// create a key/value list used for the dropdown
		controller.options = _.map(controller.airports, function(airport){ 
		      return { name : airport.Code, value : airport}; 
		    });
		
		// holds the selected airport
		controller.airport = null;
	};

	/**
	 * Is called once the user selects an airport.
	 */
	controller.airportSelected = function() {
	    var latLng = new google.maps.LatLng(controller.airport.Latitude, controller.airport.Longitude);
	
	    // don't add a marker twice
	    if (!_.contains(controller.seletedAirports, controller.airport.Code)) {
	        
	        var marker = new google.maps.Marker({
	            position: latLng,
	            map: controller.map,
	            icon : {
	                url : "https://ipsumimage.appspot.com/40x20?f=ffffff&b=000000&s=15&t=png&l="+controller.airport.Code
	            },
	            title: controller.airport.Code
	        });	 
	        
	        // change the selected airport on marker click
	        marker.addListener('click', function() {
	            controller.activeMarker = this;
	            controller.airport = _.findWhere(controller.airports, {Code: this.title});
	            // update the UI
	            $scope.$apply();
	        });
	        
	        // remember the code
	        controller.seletedAirports.push(controller.airport.Code);
        }
	    
	    // move the map a bit
        controller.map.panTo(latLng);
        controller.activeMarker = null;
	};
	
	/**
	 * Setter for the map
	 */
    controller.initGoogleMap = function(map) {
       controller.map = map;
    };
	
    /**
     * Is called on delete button click
     */
    controller.deleteMarker = function() {
        // remove marker from map and selected list
        controller.activeMarker.setMap(null);
        controller.seletedAirports = _.without(controller.seletedAirports, controller.airport.Code) ;
        controller.activeMarker = null;
        controller.airport = null;
    };
     
	controller.init();
});