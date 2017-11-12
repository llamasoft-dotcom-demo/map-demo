var globalMap;
var activeInfoWindow;
var markers = new Map();
var infoWindows = new Map();

$(function() {

    var MapFcns = {
        loadSiteList: function () {

            // create and load array for the jquery autocomplete form
            var airportList = new Array();
            for (var i in sites) {
                airportList.push(sites[i].Code);
            }

            // assign the src
            $( "#airportList" ).autocomplete({
              source: airportList
            });
        },
        
        siteListChange: function() {
            var ctl = $(this),
                airportCode = ctl.val();
                if(airportCode) {
                    var currAirport = _.findWhere(sites, {Code: airportCode});

                    // close any active infoWindows
                    if (activeInfoWindow) { 
                        activeInfoWindow.close();
                    }

                    // check if the user already selected this airport, else add it!
                    if (markers.get(currAirport.Code)) {
                        activeInfoWindow = infoWindows.get(currAirport.Code);   // just set new infoWindow and continue
                    } else {

                    // infoWindow body
                    var contentString = '<div id="content">' +
                                          '<div id="siteNotice">' +
                                          '</div>' +
                                          '<h1 id="firstHeading" class="firstHeading">' + currAirport.City +'</h1>' +
                                          '<div id="bodyContent">' +
                                            '<p>Code: ' + currAirport.Code + '</p>' +
                                            '<p>State: ' + currAirport.State + '</p>' +
                                            '<p>Full Name: ' + currAirport.FullSiteName + '</p>' +
                                            '<p>Latitude: ' + currAirport.Latitude + '</p>' +
                                            '<p>Longitude: ' + currAirport.Longitude + '</p>' +
                                          '</div>' +
                                        '</div>';


                    // make a new info window for this marker
                    var infowindow = new google.maps.InfoWindow({
                        content: contentString
                    });

                    // make temp info window so it closes without losing any data
                    activeInfoWindow = new google.maps.InfoWindow({
                        content: contentString
                    });

                    // make the marker
                    var marker = new google.maps.Marker({
                        position: {lat: currAirport.Latitude, lng: currAirport.Longitude},
                        map: globalMap,
                        title: currAirport.Code,
                    });

                    // make click listener for the marker to open info window and close/replace temp info window
                    marker.addListener('click', function() {
                        infowindow.open(globalMap, marker);
                        if (activeInfoWindow) { 
                            activeInfoWindow.close();
                        }
                        activeInfoWindow = infowindow;
                    });

                    // go to new marker
                    globalMap.panTo(marker.position);

                    markers.set(currAirport.Code, marker);
                    infoWindows.set(currAirport.Code, infowindow);

                    var markerDiv = "<div id='" + currAirport.Code + "'>" +
                                        "<div class='currentMarkerText' onclick='goToMarker(\"" + currAirport.Code + "\")'>" +
                                            "<p>" + currAirport.Code + ", " + currAirport.City + "</p>" + 
                                        "</div>" +
                                        "<div class='currentMarkerDelete' onclick='deleteMarker(\"" + currAirport.Code + "\")'><i class=' fa'>&#xf014;</i></div>" +
                                    "</div>";
                    $('#markersContainer').append(markerDiv);
                }

                // open temp infowindow either way 
                activeInfoWindow.open(globalMap, markers.get(currAirport.Code));

            }
        },
    }


    MapFcns.loadSiteList(); // load siteData

    // clear textbox onclick
    $( "#airportList" ).click(function() {
        $(this).val('');
    });

    $('#airportList').change(MapFcns.siteListChange);
    $('#airportList').autocomplete(MapFcns.siteListChange);

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


// when marker is clicked, move map to marker
function goToMarker(code) {

    globalMap.panTo(markers.get(code).position);

    // close any infoWindows that are currently open and open new infoWindow
    if (activeInfoWindow) { 
        activeInfoWindow.close();
    }

    activeInfoWindow = infoWindows.get(code);
    activeInfoWindow.open(globalMap, markers.get(code));
}

// remove pin off map and delete the marker from markers, infoWindows, and markerText
function deleteMarker(code) {
    markers.get(code).setMap(null);
    markers.delete(code);
    infoWindows.delete(code);
    $('#' + code).remove();
}

function  initMap() {
  // Callback function to create a map object and specify the DOM element for display.
  globalMap = new google.maps.Map(document.getElementById('airport-map'), {
    center: {lat: 42.2814, lng: -83.7483},
    scrollwheel: true,
    zoom: 6
  });
  
}