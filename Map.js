var globalMap;
var infoWindow = null;
	var bounds = null;
	var map1;
$(function() {

var MapFcns = {
    loadSiteList: function () {
        var airportList = $('#airport-list');
            airportList.html('');
            airportList.append('<option value=""></option>');		
			
        for (var i in sites) {
			
            var newOption = $('<option value="' + sites[i].Code + '">' + sites[i].City + '</option>');
            airportList.append(newOption)
			 
        }
    },
	siteListChange: function() {
        var ctl = $(this),
            airportCode = ctl.val();
            if(airportCode) {
                var currAirport = _.findWhere(sites, {Code: airportCode});
               $('#setting-code').text(currAirport.Code);
                $('#setting-city').text(currAirport.City);
				$('#setting-state').text(currAirport.State);
				$('#setting-airportname').text(currAirport.FullSiteName);
				$('#setting-lat').text(currAirport.Latitude);
				$('#setting-long').text(currAirport.Longitude);
                 var uluru = {lat: currAirport.Latitude, lng: currAirport.Longitude};
                 var marker = new google.maps.Marker({
                 position:uluru,
				 map:map1,
				 cityName:currAirport.City,
				 stateName:currAirport.State,
                 airportName:currAirport.FullSiteName
                }); 
				
		infoWindow = new google.maps.InfoWindow();

		
		google.maps.event.addListener(marker, 'click',(function(marker) {
									return function() {
										var contentMaterial = '<p>Airport Name: '+ this.airportName +'</p>'; 
										
										 contentMaterial = contentMaterial +  '<p>City Name: '+ this.cityName +'</p>'; 
										contentMaterial= contentMaterial +  '<p>State Name: '+ this.stateName +'</p>';
										infoWindow.close();
										infoWindow = new google.maps.InfoWindow();
										infoWindow.setContent(contentMaterial);
										infoWindow.open(map1, marker);
									};
								})(marker));
		
		
		
            }
		//bounds = new google.maps.LatLngBounds();
			
			var latLngData = [];
			//latLngData[0].lat=currAirport.Latitude;
			//latLngData[0].lang=currAirport.Longitude;
			//zoomTo(latLngData);
			var latLng1;
			
		 latLng1 = new google.maps.LatLng(currAirport.Latitude, currAirport.Longitude);
		
		 bounds.extend(latLng1);
		 
			map1.fitBounds(bounds);
			map1.setCenter(bounds.getCenter());
			map1.setZoom(5);
    }
}






MapFcns.loadSiteList();

$('#airport-list').change(MapFcns.siteListChange);
$('#exercise-toggle').click(function() {
    var  toggleCtl = $(this),
         toggleVal = toggleCtl.text();
    if (toggleVal == '-') {
        toggleCtl.text('+');
        $('#exercise-instructions').hide();
    } else {
        toggleCtl.text('-');
        $('#exercise-instructions').show();
}
});

});
function  initMap() {
  // Callback function to create a map object and specify the DOM element for display.
  map1 = new google.maps.Map(document.getElementById('airport-map'), {
    center: {lat: 42.2814, lng: -83.7483},
    scrollwheel: true,
    zoom: 4
  });
  bounds = new google.maps.LatLngBounds();
    }
	
	
function deleteMarker(){
	initMap();
}
	
	
