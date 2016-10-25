
//How to get rid of this global crap?
var map;


/*
 *	Google Maps API initialization code
 */
function initMap() {
	map = new google.maps.Map(document.getElementById('airport-map'), {
		center: {
			lat: 42.2814,
			lng: -83.7483
		},
		scrollwheel: true,
		zoom: 6
	});
}





$(function() {
	
	var markerMap = {};
	var defaultOption = "Please Select an Option...";
	
	/*
	 *	Helper functions
	 */
	var createInfoWindowContent = function(airportObject, position, zoom) {
		return "<div class='color-override'>Airport Name: " + airportObject.FullSiteName.substring(12) + "<br> Airport Code: " + airportObject.Code
		+ "<br> Location: " + airportObject.City + ", " + airportObject.State
		+ "<br> Coordinates: (" + airportObject.Latitude + ", " + airportObject.Longitude + ")</div>";
	};
	
	
	var createTableRow = function(airportObject) {
		return "<tr id='tr-" + airportObject.Code + "' data-value='" + airportObject.Code + "' class='data-table-row-click'>"
			+ "<td>" + getFormattedAirportName(airportObject) + "</td>"
			+ "<td>" + airportObject.Code + "</td>"
			+ "<td>" + getFormattedLocation(airportObject) + "</td>"
			+ "<td>" + airportObject.Latitude + ", " + airportObject.Longitude + "</td>"
			+ "</tr>";
	};
	
	
	var isNullOrUndefined = function(obj) {
		return obj === null || obj === undefined;
	}
	
	var getFormattedLocation = function(airportObject) {
		return airportObject.City + ", " + airportObject.State;
	}
	
	var getFormattedAirportName = function(airportObject) {
		return airportObject.FullSiteName.substring(12);
	}
	
	
	/*
	 *	API functions
	 */
	var mapApi = {
		loadSiteList: function () {
			//Sort the data... a no brainer
			var sortedData = _.sortBy(airportData.sites, function (site) { return getFormattedLocation(site); });
			var airportList = $("#airport-list");
			
			airportList.html("");
			airportList.append("<option value=''>" + defaultOption + "</option>");
			
			//Populate the combo box
			for (var i in sortedData) {
				var formattedString = getFormattedLocation(sortedData[i]) + " - " + getFormattedAirportName(sortedData[i]) + " (" + sortedData[i].Code + ") ";
				var newOption = $("<option value='" + sortedData[i].Code + "'>" + formattedString + "</option>");
				airportList.append(newOption);
			}
		},
		
		
		siteListChange: function() {
			var ctl = $(this);
			var airportCode = ctl.val();
			
			if (airportCode) {
				//Give me the airport with the given code
				var airportObject = _.findWhere(airportData.sites, {Code: airportCode});
				
				//First make sure row isn't already there...
				var rowList = $("#tr-" + airportObject.Code);
				
				//If the airport is already in the table don't add it again
				if (rowList.length) {
					mapApi.panToAirport(airportObject);
					return;
				}
				
				//Create a row and insert into the table
				$("#marker-table").find("tbody").append(createTableRow(airportObject));
				
				//Add a marker for this airport
				mapApi.addAirportMarker(airportObject);
			}
		},
		
		addAirportMarker: function(airportObject) {
			var marker;
			//First see if we already have a marker object at this location
			if (markerMap[airportObject.Code] === undefined) {
				//No it isn't there. Create a new Marker object
				marker = new google.maps.Marker({
						position: { 
							lat: airportObject.Latitude,
							lng: airportObject.Longitude
						},
						map: map,
						title: airportObject.Code
				});
				//And "cache" it
				markerMap[airportObject.Code] = marker;
			} else {
				marker = markerMap[airportObject.Code];
				marker.setMap(map);
			}
			
			//Pan to the location
			mapApi.panToAirport(airportObject, marker);
			
			//Now open an info window as shown in the example here https://developers.google.com/maps/documentation/javascript/examples/map-coordinates
			marker.infowindow = new google.maps.InfoWindow();
			
			//Create an InfoWindow object to save "screen real estate"
			var markerPosition = marker.getPosition();
			var content = createInfoWindowContent(airportObject, markerPosition, map.getZoom());
			marker.infowindow.setContent(content);
			marker.infowindow.setPosition(markerPosition);
			marker.infowindow.open(map, marker);
			
			//When the user clicks on a marker, open up the info window. Example found at https://developers.google.com/maps/documentation/javascript/infowindows
			marker.addListener("click", function() {
				marker.infowindow.open(map, marker);
			});
			
			//Add the ability to right click to close marker
			marker.addListener("rightclick", function() {
				marker.infowindow.close();
				marker.setMap(null); //Close the marker
				$("#tr-" + airportObject.Code).remove(); //Remove item from the table
				
				//Set the combo box selection back to the default option
				$("select>option:eq(0)").prop("selected", true);
			});
		},
		
		panToAirport: function(airportObject, marker) {
			//Pan over to the Marker
			if (isNullOrUndefined(marker)) {
				marker = markerMap[airportObject.Code];
			}
			marker.setMap(map);
			map.panTo(marker.getPosition());
		}
	};
	
	
	//Load the combo box at start up
	mapApi.loadSiteList();
	
	
	
	/*
	 *	Event handlers, etc
	 */
	$('#airport-list').change(mapApi.siteListChange);
	
	//When you click on a table row, pan to the airport
	$("body").on("click", "tr.data-table-row-click", function() {
		var obj = $(this);
		var tableRowValue = $(this).data("value");
		
		var airportObject = _.findWhere(
			airportData.sites,
			{
				Code: tableRowValue
			}
		);
		mapApi.panToAirport(airportObject, undefined);
	});
});
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	