sites.sort(function(a,b) {
	return a.Code.localeCompare(b.Code);
});

var airportMap = (function() {

	var globalMap;
	var markerIndex = 1;
	var mapMarkers = [];
	var infoWindow;
	
	var addAirportListEntry = function(airport, index) {
		var trimmedName = airport.FullSiteName.substr(airport.FullSiteName.lastIndexOf('_')+1);
		var letter = String.fromCharCode("A".charCodeAt(0) + index - 1);
		var newListItem = "<li id='airport-listitem-" + index + "'>"
						+ "<div class='airport-list-titlebar'>"
						+ "<div class='letter-code'>" + letter + "</div>"
						+ "<div id='airport-listitem-" + index + "-remove' class='remove-button'>X</div>"
						+ "<div class='airport-code'>" + airport.Code + "</div>"
						+ "</div>"
						+ "<div>" + trimmedName + "</div>"
						+ "<div>" + airport.City + ", " + airport.State + "</div>"
						+ "<div>" + airport.Latitude + ", " + airport.Longitude + "</div>"
						+ "</li>";
						
		//Insert new item into list of airport markers.  Try to keep the list ordered.
		if(index == 1) {
			$('#airport-list').prepend(newListItem);
		} else if (index > 1){
			$('#airport-listitem-' + (index - 1)).after(newListItem);
		}
		
		var removeButtonFunc = function() {
			var markerToRemove = _.find(mapMarkers, function(item) { return item.title == airport.Code; });
			removeMarker(markerToRemove);
			removeAirportListEntry(index);
			getInfoWindow().close();
		};
		
		$('#airport-listitem-' + index + '-remove').click(removeButtonFunc);
	}
	
	var addMarker = function(airport) {
		var index = getNextMarkerIndex();
		
		var marker = new google.maps.Marker({
			position: {lat: airport.Latitude, lng: airport.Longitude},
			map: globalMap,
			//label: "" + index,
			title: airport.Code
		});
		
		marker.index = index;
		
		marker.addListener('click', function() {
			var trimmedName = airport.FullSiteName.substr(airport.FullSiteName.lastIndexOf('_')+1);
			var infoContent = "<div>" + airport.Code + "</div>"
							+ "<div>" + trimmedName + "</div>"
							+ "<div>" + airport.City + ", " + airport.State + "</div>"
							+ "<div>" + airport.Latitude + ", " + airport.Longitude + "</div>"
							+ "<a href='javascript:;' id='remove-marker-link'>remove</a>";
												
			getInfoWindow().close();
					
			getInfoWindow().setContent(infoContent);
					
			getInfoWindow().open(globalMap, marker);
						
			var removeLinkFunc = function(e) {
				e.preventDefault();
				removeMarker(marker);
				removeAirportListEntry(marker.index);
				getInfoWindow().close();
			};
						
			$('#remove-marker-link').click(removeLinkFunc);
		});
		
		mapMarkers.push(marker);
		
		return marker;
	};
	
	var getNextMarkerIndex = function() {
		while(_.findWhere(mapMarkers, {index: markerIndex})) {
			markerIndex++;
		}
		return markerIndex;
	};
	
	var getInfoWindow = function() {
		if(!infoWindow) { infoWindow = new google.maps.InfoWindow(); }
		return infoWindow;
	};
	
	var recalcViewport = function() {
		if(mapMarkers.length == 1) {
			globalMap.panTo(mapMarkers[0].getPosition());
		} else if (mapMarkers.length > 1) {
			var bounds = new google.maps.LatLngBounds();
			_.each(mapMarkers, function(marker) { 
				bounds.extend(marker.getPosition()); 
			});
			globalMap.fitBounds(bounds);
		}
	};
	
	var removeAirportListEntry = function(index) {
		$('#airport-listitem-' + index).remove();
	}
	
	var removeMarker = function(marker) {
		mapMarkers = _.filter(mapMarkers, function(elem) { return elem.title != marker.title; });
		marker.setMap(null);
		if(marker.index < markerIndex) {
			markerIndex = marker.index;
		}
	};
	
	return {
		
		initMap: function() {
			// Callback function to create a map object and specify the DOM element for display.
			globalMap = new google.maps.Map(document.getElementById('airport-map'), {
				center: {lat: 42.2814, lng: -83.7483},
				scrollwheel: true,
				zoom: 6
			});  
		},
		
		loadSiteList: function () {
			var airportSelect = $('#airport-select');
				airportSelect.html('');
				airportSelect.append('<option value=""></option>');	
			for (var i in sites) {
				var newOption = $('<option value="' + sites[i].Code + '">' + sites[i].Code + '</option>');
				airportSelect.append(newOption);
			}
		},
			
		siteListChange: function() {		
			var ctl = $(this), airportCode = ctl.val();
            
			if(airportCode && markerIndex < 26) {
				var currAirport = _.findWhere(sites, {Code: airportCode});
				var trimmedName = currAirport.FullSiteName.substr(currAirport.FullSiteName.lastIndexOf('_')+1);
				$('#airport-code').text(currAirport.Code);
				$('#airport-city').text(currAirport.City);
				$('#airport-state').text(currAirport.State);
				$('#airport-name').text(trimmedName);
				$('#airport-lat').text(currAirport.Latitude);
				$('#airport-long').text(currAirport.Longitude);
                									
				if(!_.findWhere(mapMarkers, {title: airportCode})) {
					
					var marker = addMarker(currAirport);
					
					addAirportListEntry(currAirport, marker.index);
					
					getInfoWindow().close();

					recalcViewport();
				}
			}
		}
		
	};
	
})();


$(function() {

airportMap.loadSiteList();

$('#airport-select').change(airportMap.siteListChange);

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