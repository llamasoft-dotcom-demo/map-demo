var globalMap;
var infoTemplate;
var markers = {};

$(function() {
	// get info window template up front since we could be using it often
	_.templateSettings.variable = "data";
	infoTemplate = _.template($("script.infoTemplate").html());
	
	sites.sort(function (a, b) {
		if (a.Code < b.Code) {
			return -1;
		}
		
		if (a.Code > b.Code) {
			return 1;
		}
		
		return 0;
	});
	
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


// Handles setting up the control
function setupSelectControl(controlDiv, MapFcns) {
	var controlTemplate = _.template($("script.controlTemplate").html());
	
	var data = {
		options: MapFcns.loadSiteList()
	};
	
	controlDiv.innerHTML = controlTemplate(data);
	controlDiv.index = 1;
	controlDiv.querySelector("#airport-list").addEventListener('change', MapFcns.siteListChange);
}


function markerHandler(currAirport) {
	var data = {
		Code: currAirport.Code,
		City: currAirport.City,
		State: currAirport.State,
		FullSiteName: currAirport.FullSiteName,
		Latitude: currAirport.Latitude,
		Longitude: currAirport.Longitude						
	};					
	
	if (!markers.hasOwnProperty(currAirport.Code)) {
		var marker = new google.maps.Marker({
			position: {lat: currAirport.Latitude, lng: currAirport.Longitude},
			map: globalMap,
			title: currAirport.Code
		});
		
		var infowindow = new google.maps.InfoWindow({
		  content: infoTemplate(data)
		});
												
		marker.addListener('click', function() {
			infowindow.open(globalMap, marker);
		});
		
		marker.addListener('rightclick', function() {
			marker.setMap(null);
		});
		
		markers[currAirport.Code] = marker;
	} else {
		markers[currAirport.Code].setMap(globalMap);
	}	
}


function  initMap() {
	var MapFcns = {
		loadSiteList: function () {
			var siteList = [];
			
			for (var i in sites) {
				siteList.push(sites[i].Code);
			}
			
			return siteList;
		},
		
		siteListChange: function() {
			var ctl = $(this),
				airportCode = ctl.val();
				if(airportCode) {
					var currAirport = _.findWhere(sites, {Code: airportCode}),
						latLng = new google.maps.LatLng(currAirport.Latitude, currAirport.Longitude);
					
					markerHandler(currAirport);
					globalMap.panTo(latLng);
				}
		}
	}

	// Callback function to create a map object and specify the DOM element for display.
	globalMap = new google.maps.Map(document.getElementById('airport-map'), {
		center: {lat: 42.2814, lng: -83.7483},
		scrollwheel: true,
		zoom: 6
	});
  
	// Create google map control for selecting airports
	var controlDiv = document.createElement('div');
	setupSelectControl(controlDiv, MapFcns);

	globalMap.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDiv); 
}
