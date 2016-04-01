var globalMap;

$(function() {

var airports = [];
var markedLocations = [];
var MapFcns = {

    loadSiteList: function () {

       
        var airportList = $('#airport-list');
            airportList.html('');
            airportList.append('<option value=""></option>');
        for (var i in sites) {

            airports.push(sites[i].City);
        }

        // Sort all airport codes
        airports.sort();

        // Displaying sorted airport codes
        for(var code in airports)
        {   
            var newOption = $('<option value="' + airports[code] + '">' + airports[code] + '</option>');
            airportList.append(newOption);
        }
    },
    
    siteListChange: function() {
        var ctl = $(this),
            airportCity = ctl.val();
            if(airportCity) {
                var currAirport = GetAirportCityDetails(airportCity);
                $('#setting-code').text(currAirport.Code);
                $('#setting-city').text(currAirport.City);
                $('#setting-state').text(currAirport.State);
                $('#setting-fullName').text(currAirport.FullSiteName);
                $('#setting-lat').text(currAirport.Latitude);
                $('#setting-long').text(currAirport.Longitude);

                var locationString = GetLocationString(currAirport.Latitude, currAirport.Longitude);
                var isMarkerExisting = markedLocations.indexOf(locationString);

                if(isMarkerExisting == -1)
                {
                    var marker = new google.maps.Marker({
                        position: {lat: currAirport.Latitude, lng: currAirport.Longitude},
                        map: globalMap,
                        title: currAirport.Code
                    });

                  // Before adding this line, the user can be able to see only few part of the map
                  // So that if he/she choses any other location that was not seen in the displayed portion of the map
                  // user had to move the map until he finds the location marker
                  // but now, as soon as selecting the city name in the dropdown
                  // map gets centered to those latitudes and longitudes and user no need to move map by his own.
                  marker.map.setCenter({lat: currAirport.Latitude, lng: currAirport.Longitude}); 

                  // push the current location to the markedLocations collection
                  // To keep track of the marked locations
                  markedLocations.push(locationString);


                  marker.addListener('dblclick', function(event) {
                        removeMarker(marker);
                    });

                  marker.addListener('click', function(event)
                  {
                        var CityInfo = ShowInfoBox(marker, airportCity);
                        var infowindow = new google.maps.InfoWindow({
                            content: CityInfo
                        });

                        infowindow.open(marker.map,marker);
                  });
                }
                else if(isMarkerExisting >= 0){

                    alert("Location Already marked");
                }
            }
    }
}

// Removes Current Marker on double click
removeMarker= function(marker)
{
    // Get the current marker longitudes and longitudes in the form of string we stored earlier
    // in markedLocations collection
    var locationString = GetLocationString(marker.getPosition().lat(), marker.getPosition().lng().toFixed(4));

    // Get the Index of the current location string
    var markedLocationIndex = markedLocations.indexOf(locationString);

    console.log(markedLocations);
    console.log("marked Location index is:" + markedLocationIndex);
    // remove the location string from the collection 
    markedLocations.splice(markedLocationIndex,1);

    // remove the marker
    marker.setMap(null);
}

// Returns the location string by using parameters latitude and longitude
GetLocationString = function(latitude, longitude)
{
    return "[" + latitude + "," + longitude + "]";
}


// Gets Selected City Ariport Details
GetAirportCityDetails = function(airportCity)
{
    var currAirport = _.findWhere(sites, {City: airportCity});
    return currAirport;
}

// Show Info Box with current City Details
ShowInfoBox = function(marker, airportCity)
{
    var currentCity = GetAirportCityDetails(airportCity);
    var contentString = '<div><h1>'+ currentCity.Code +'</h1></div><div><h2>' + currentCity.City + "," + currentCity.State + "<h2></div><div><h3>" + currentCity.FullSiteName + "</h3></div><div>Latitude, Longitude: " + currentCity.Latitude + "," + currentCity.Longitude + "</div>";
    return contentString;
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
  globalMap = new google.maps.Map(document.getElementById('airport-map'), {
    center: {lat: 42.2814, lng: -83.7483},
    scrollwheel: true,
    zoom: 6
  });
  
    }