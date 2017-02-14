var globalMap;
var markers = [];
var nextMarkerId = 0;


$(function() {

    var MapFcns = {
        loadSiteList: function () {
            var airportList = $('#airport-list');
                airportList.html('');
                airportList.append('<option value=""></option>');

            // Sort the list of sites
            sites.sort(function(site1, site2) {
                return site1.Code.localeCompare(site2.Code);
            });

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
                    $('#setting-code').text(currAirport.Code);
                    $('#setting-city').text(currAirport.City);
                    $('#setting-state').text(currAirport.State);
                    $('#setting-fullName').text(currAirport.FullSiteName);
                    $('#setting-lat').text(currAirport.Latitude);
                    $('#setting-long').text(currAirport.Longitude);
                    
                    var marker = createMarker(currAirport)
                    markers.push(marker);
                    
                    // Automatically pan to the marker
                    globalMap.panTo(marker.getPosition());
                }
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


/**
* Creates a new marker and adds it to the map.
*/
function createMarker(airport) {
    var marker = new google.maps.Marker({
            position: {lat: airport.Latitude, lng: airport.Longitude},
            map: globalMap,
            title: airport.Code
        });

    google.maps.event.addListener(marker, "click", function (e) {
        var friendlyAirportName = marker.metaData.FullSiteName.substring(12, marker.metaData.FullSiteName.length);
        var messageBox = "<div class='infoBox'>" +
                             "<div> Code: " + marker.metaData.Code + "</div>" +
                             "<div> City: " + marker.metaData.City + "</div>" +
                             "<div> State: " + marker.metaData.State + "</div>" +
                             "<div> Name: " + friendlyAirportName + "</div>" +
                             "<div> Lat: " + marker.metaData.Latitude + "</div>" +
                             "<div> Long: " + marker.metaData.Longitude + "</div>" +
                             "<input class='deleteMarkerButton' type='button' value='Delete' onclick='deleteMarker("+marker.id+");'>" +
                         "</div>";
        var infoWindow = new google.maps.InfoWindow({
            content: messageBox
        });
        infoWindow.open(globalMap, marker);
    });

    marker.metaData = airport;
    marker.id = nextMarkerId++;
    return marker;
}


/**
* Removes the provided marker from the map given its id value.
*/
function deleteMarker(id) {
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].id == id) {                 
            markers[i].setMap(null);
            markers.splice(i, 1);
            return;
        }
    }
}



    
function  initMap() {
  // Callback function to create a map object and specify the DOM element for display.
  globalMap = new google.maps.Map(document.getElementById('airport-map'), {
    center: {lat: 42.2814, lng: -83.7483},
    scrollwheel: true,
    zoom: 6
  });
  
    }