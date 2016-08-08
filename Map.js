var globalMap;
var MapFcns = {
	markers: [],
	infoWindows: [],
    loadSiteList: function () {
        var airportList = $('#airport-list');
            airportList.html('');
            airportList.append('<option value=""></option>');
			sites = _.sortBy(sites, 'Code');
        for (var i in sites) {
            var newOption = $('<option value="' + sites[i].Code + '">' + sites[i].Code + '</option>');
            airportList.append(newOption);
			
        }
    },
    siteListChange: function() {
        var ctl = $(this),
        airportCode = ctl.val();
        if(airportCode) {
            var currAirport = _.findWhere(sites, {Code: airportCode});
			MapFcns.setDataText(currAirport);
			var marker = MapFcns.addMarker(airportCode, currAirport);
			MapFcns.toggleMarkerLink(true);
			MapFcns.moveToMarker(currAirport.Latitude,currAirport.Longitude);
        }
    },
	toggleMarkerLink: function(isMenuChange) {
		var airportList = $('#airport-list');
		if ($(airportList).next().text() == "remove marker" && !isMenuChange){
			$('#airport-list').after('<a href="#" id="add-marker">add marker</a>').after("&nbsp;");
			$('#remove-marker').remove();
		}else{
			$('#remove-marker').remove();
			$('#airport-list').after('<a href="#" id="remove-marker">remove marker</a>').after("&nbsp;");
			$('#add-marker').remove();
		}
	},
	setDataText: function(currAirport){
        $('#setting-code').text(currAirport.Code);
        $('#setting-city').text(currAirport.City);
		$('#setting-state').text(currAirport.State);
		$('#setting-fullname').text(currAirport.FullSiteName);
		$('#setting-lat').text(currAirport.Latitude);
		$('#setting-long').text(currAirport.Longitude);
	}, 
	addMarker: function(airportCode, currAirport) {
		for (i in MapFcns.markers){
			MapFcns.deleteMarker(MapFcns.markers[i]);
		}
         marker = new google.maps.Marker({
            position: {lat: currAirport.Latitude, lng: currAirport.Longitude},
            map: globalMap,
            title: currAirport.Code
        });
		MapFcns.markers.push(marker);			
		MapFcns.addInfoWindow(marker);
	},
	addInfoWindow(marker){
		infoContent = $('<div>').append($('#airport-settings').clone()).html();
		MapFcns.deleteInfoWindows();
	    var infowindow = new google.maps.InfoWindow({
			content:  infoContent
        });
		infowindow.open(globalMap, marker);
		google.maps.event.addListener(infowindow, 'domready', function() {
		      $('.gm-style-iw #airport-settings').show();
		});
		marker.addListener('click', function() {
		    infowindow.open(globalMap, marker);
		  });
		MapFcns.infoWindows.push(infowindow);
	},
	deleteInfoWindows: function() {
		for (i in MapFcns.infoWindows){
			MapFcns.infoWindows[i].close();
		}
	},
	deleteMarker: function(marker){
		marker.setMap(null);
		MapFcns.markers = _.without(MapFcns.markers, _.findWhere(MapFcns.markers, {title: marker.title}));
	},
	moveToMarker: function(lat, lng){
	    var center = new google.maps.LatLng(lat, lng);
	    globalMap.panTo(center);
	}
}


$(function() {
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

	$('body').on('click', '#add-marker', function() {
		selectedCode = $('#airport-list').children(':selected').text();
		var currAirport = _.findWhere(sites, {Code: selectedCode});
		MapFcns.addMarker(selectedCode, currAirport);
		MapFcns.toggleMarkerLink();
		return false;
	});

	$('body').on('click', '#remove-marker', function() {
		selectedCode = $('#airport-list').children(':selected').text();
		markerToDelete = _.findWhere(MapFcns.markers, {title: selectedCode});
		if (markerToDelete){
			MapFcns.deleteMarker(markerToDelete);
		}
		MapFcns.toggleMarkerLink();
		return false;
	});
});




    
function  initMap() {
  // Callback function to create a map object and specify the DOM element for display.
  globalMap = new google.maps.Map(document.getElementById('airport-map'), {
    center: {lat: 42.2814, lng: -83.7483},
    scrollwheel: true,
    zoom: 6
  });
  
    }