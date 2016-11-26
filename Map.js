 // Not a fan of global variables but I followed suit. 

 // If using Angular 2 I would have created a map service 
 // that would be injected into various components.
 // (Angular 2 implements Dependency Injection & more OO structure)
var globalMap; 
var globalMarkerCluster;
var globalAddedMarkers;

$(function() {
    var MapFcns = {
        loadSiteList: function () {
            var airportList = $('#airport-list');
                airportList.html('');
                airportList.append('<option value=""></option>');

            var sortedSites =_.sortBy(sites, function(a) { return a.Code; })
            for (var i in sortedSites) {
                var newOption = $('<option value="' + sortedSites[i].Code + '">' + sortedSites[i].Code + '</option>');
                airportList.append(newOption);
            }
        },
        
        siteListChange: function() {
            var ctl = $(this),
                airportCode = ctl.val();
                if(airportCode) {
                    var currentAirport = _.findWhere(sites, {Code: airportCode});

                    setSelectedAirportData(currentAirport);             
                    MapFcns.createMarker(currentAirport);
                    
                    globalMap.setZoom(7);
                    globalMap.panTo({lat: currentAirport.Latitude, lng: currentAirport.Longitude});
                }
        },

        createMarker: function(currentAirport) {
            var index = _.findIndex(globalAddedMarkers, { title: currentAirport.Code});
            if(index > -1) {
                messageSystem.showMessageType(currentAirport.Code + " Airport already Added", "info");
                return;
            }

            var marker = new google.maps.Marker({
                                position: {lat: currentAirport.Latitude, lng: currentAirport.Longitude},
                                icon: './selectedAirport.PNG',
                                title: currentAirport.Code,
                                map: globalMap,
                            });

            globalAddedMarkers.push(marker);
            initMarkerInfoWindow(currentAirport, marker);
            messageSystem.showMessageType(currentAirport.Code + " Airport Added Successfully", "success");
        } 
    }

    MapFcns.loadSiteList();
    $('#airport-list').change(MapFcns.siteListChange);

});

function deleteMarker(element) {
    var index = _.findIndex(globalAddedMarkers, { title: element.name});
    if (index > -1) {
        globalAddedMarkers[index].setMap(null);
        globalAddedMarkers.splice(index, 1);
        messageSystem.showMessageType("Airport successfully deleted", "success");
    }
    else {
        messageSystem.showMessageType("Unable to delete Airport Marker!", "failure");
    }
}

function initMap() {
    globalMap = new google.maps.Map(document.getElementById('airport-map'), {
        center: {lat: 39.2322, lng: -97.8149},
        scrollwheel: true,
        zoom: 5
    });

    globalMarkers = [];
    initAllMarkers();

    globalAddedMarkers = [];
    messageSystem.showMessageType("Map Loaded", "info");
}

// Initialize all markers for preview of all airport locations
function initAllMarkers() {
    for(var i = 0; i < sites.length; i++) {
        var infoWindow = new google.maps.InfoWindow();
          
        var marker = new google.maps.Marker({
            position: {lat: sites[i].Latitude, lng: sites[i].Longitude},
            title: sites[i].Code
        });

        marker.setVisible(false);
        globalMarkers.push(marker);
    }
}

// Initialize Info Window which appears upon clicking added Airport
function initMarkerInfoWindow(currentAirport, marker) {
    var infoWindow = new google.maps.InfoWindow();

    var shortSitePattern = /^[A-Z]+_[A-Z]+_(.+)$/g; // Parses common Airport name
    var shortSiteName = shortSitePattern.exec(currentAirport.FullSiteName)[1];

    var html = "<strong>" + currentAirport.Code + "</strong>" +
                "<br/>" + shortSiteName +
                "<br/>" + currentAirport.City + 
                ", " + currentAirport.State +
                "<br/>(" + currentAirport.Latitude +
                ", " + currentAirport.Longitude + ")" +
                "<br/> <button onclick='deleteMarker(this);' name='"+ currentAirport.Code +"'>Remove</button>";

    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.setContent(html);
        infoWindow.open(globalMap, marker);
    });

    infoWindow.setContent(html);
    infoWindow.open(globalMap, marker);
}


function setSelectedAirportData(currAirport) {
    $('#setting-code').text(currAirport.Code);
    $('#setting-city').text(currAirport.City);
    $('#setting-state').text(currAirport.State);
    $('#setting-fullSiteName').text(currAirport.FullSiteName);
    $('#setting-lat').text(currAirport.Latitude);
    $('#setting-long').text(currAirport.Longitude);
}

$("#airport-settings").hide();
$("#hideAllSites").hide();

$("#toggleSettings").click(function() {
  $("#airport-settings").toggle("slow", function() {
  });
});

$("#showAllSites").click(function() {
   for (var i = 0; i < globalMarkers.length; i++) {                 
        globalMarkers[i].setVisible(true);
    }

    // Create clusters of markers for better visibility
    globalMarkerCluster = new MarkerClusterer(globalMap, globalMarkers,
        {ignoreHidden: true, imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

    globalMap.setZoom(4);
    globalMap.panTo({lat: 39.2322, lng: -97.8149});
    $("#showAllSites").hide();
    $("#hideAllSites").show();
});

$("#hideAllSites").click(function() {
   for (var i = 0; i < globalMarkers.length; i++) {                 
        globalMarkers[i].setVisible(false);
    }

   globalMarkerCluster.clearMarkers();
   $("#hideAllSites").hide();
   $("#showAllSites").show();
});
