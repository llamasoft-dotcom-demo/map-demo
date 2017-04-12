var globalMap;
var globalMarkers = [];
var curMarker;
var curSite;
var infowindow;

$(function () {
    var MapFcns = {
        loadSiteList: function () {
            sites.sort(function(a, b){
                if (a.Code < b.Code) return -1;
                if (a.Code > b.Code) return 1;
                return 0;
            });

            var airportList = $('#airport-list');
            airportList.html('');
            airportList.append('<option value=""></option>');
            for (var i in sites) {
                var newOption = $('<option value="' + sites[i].Code + '">' + sites[i].Code + '</option>');
                airportList.append(newOption);
            }
        },

        siteListChange: function () {
            var ctl = $(this),
                airportCode = ctl.val();
            if (airportCode) {
                var currAirport = _.findWhere(sites, { Code: airportCode });
                $('#setting-code').text(currAirport.Code);
                $('#setting-city').text(currAirport.City);
                $('#setting-state').text(currAirport.State);
                $('#setting-name').text(String(currAirport.FullSiteName).substring(12, currAirport.FullSiteName.length));
                $('#setting-lat').text(currAirport.Latitude);
                $('#setting-long').text(currAirport.Longitude);

                var marker = new google.maps.Marker({
                    position: { lat: currAirport.Latitude, lng: currAirport.Longitude },
                    map: globalMap,
                    title: currAirport.Code
                });

                //center the map on the selected airport
                globalMap.setCenter(marker.position);

                //Event listener for Mouseover/Hover Over
                marker.addListener('mouseover', function (event) {
                    //set the current values
                    curMarker = this;
                    curSite = currAirport;

                    //ensure no infowindows are open
                    infowindow.close();

                    //get picture for airport
                    var coordinates = new google.maps.LatLng(currAirport.Latitude, currAirport.Longitude);
                    var service = new google.maps.places.PlacesService(globalMap);
                    
                    //create the request for textSearch
                    var request = {
                        location: new google.maps.LatLng(currAirport.Latitude, currAirport.Longitude),
                        radius: '500',
                        query: currAirport.Code + ' AIRPORT'
                    };

                    //use a textSearch to get the picture and set the tooltip/infowindow
                    service.textSearch(request, getPictureCallback);

                });

                //Event for MouseOut
                marker.addListener('mouseout', function (event) {
                    if (infowindow != null) {
                        infowindow.close();
                        infowindow.setContent("");
                    }
                });

                //Event Listener for double click - clears the marker
                marker.addListener('dblclick', function (event) {
                    marker.setMap(null);
                });

                //check if this airport is already a marker
                var alreadyMarker = false;
                for (var i = 0; i < globalMarkers.length; i++) {
                    if (marker.title == globalMarkers[i].title) {
                        alreadyMarker = true;
                        break;
                    }
                }
                if (!alreadyMarker) {
                    globalMarkers.push(marker);
                }
            }
        }
    }

    //Callback for textSearch
    function getPictureCallback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            //get the picture of the airport
            var pictureUrl = "";
            if (results[0].photos != null && results[0].photos.length > 0) {
                pictureUrl = results[0].photos[0].getUrl({ 'maxWidth': 120, 'maxHeight': 120 });
            }

            //set the infowindow information
            htmlInfo = "<div class='tooltip-content'><div class='tooltip-picture'><img src='" + pictureUrl + "' /></div>";
            htmlInfo += "<div class='tooltip-content'>" + String(curSite.FullSiteName).substring(12, curSite.FullSiteName.length) + "<br />";
            htmlInfo += curSite.City + ", " + curSite.State + "<br />";
            htmlInfo += curSite.Latitude + ", " + curSite.Longitude + "<br />";
            htmlInfo += "</div>";

            infowindow.setContent(htmlInfo);
            infowindow.open(globalMap, curMarker);

        }
    }



    MapFcns.loadSiteList();
    $('#airport-list').change(MapFcns.siteListChange);
    $('#exercise-toggle').click(function () {
        var toggleCtl = $(this),
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


function initMap() {
    // Callback function to create a map object and specify the DOM element for display.
    globalMap = new google.maps.Map(document.getElementById('airport-map'), {
        center: { lat: 42.2814, lng: -83.7483 },
        scrollwheel: true,
        zoom: 6
    });

    infowindow = new google.maps.InfoWindow({
        maxWidth: 400,
        infoBoxClearance: new google.maps.Size(1, 1),
        disableAutoPan: false
    });

}
