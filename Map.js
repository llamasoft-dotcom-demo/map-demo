var globalMap;

$(function() {

// Hashtable of all markers, key is airportCode
var globalMarkers = {};

// 
var currAirportCode = '';

var MapFcns = {
    loadSiteList: function () {
        var sortedSites = _.sortBy(sites, function(site) {
            return site.Code;
        });

        var airportList = $('#airport-list');
            airportList.html('');
            airportList.append('<option value=""></option>');
        for (var i in sortedSites) {
            var newOption = $('<option value="' + sortedSites[i].Code + '">' + sortedSites[i].Code + '</option>');
            airportList.append(newOption);
        }
    },
    
    siteListChange: function() {        
        var ctl = $(this),
            airportCode = ctl.val();

        if(airportCode) {
            var currAirport = _.findWhere(sites, {Code: airportCode});
            currAirportCode = currAirport.Code;
            
            var siteName = currAirport.FullSiteName.split('_')[2];
            
            $('#airport-code').text(currAirport.Code);
            $('#airport-city').text(currAirport.City);
            $('#airport-state').text(currAirport.State);
            $('#airport-name').text(siteName);
            $('#airport-lat').text(currAirport.Latitude);
            $('#airport-long').text(currAirport.Longitude);
            
            var marker;

            // Create marker if it doesn't exist already
            if (!globalMarkers.hasOwnProperty(currAirportCode)) {
                marker = new google.maps.Marker({
                    position: {lat: currAirport.Latitude, lng: currAirport.Longitude},
                    map: globalMap,
                    title: currAirport.Code
                });
                
                globalMarkers[currAirport.Code] = marker; 
            } else {
                marker = globalMarkers[currAirport.Code];
            }
            
            // If marker is not within bounds of map, jump to marker
            if (!globalMap.getBounds().contains(marker.getPosition())) {
                globalMap.setCenter(marker.getPosition());                            
            }
        }
    }
}

$('#deleteAirportButton').click(function() {
    if (globalMarkers.hasOwnProperty(currAirportCode)) {
        globalMarkers[currAirportCode].setMap(null);
        delete globalMarkers[currAirportCode];
    }
});

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