var globalMap;
var globalInfo;
var globalMarker;
var globalList;

var MapFcns = {
    loadSiteList: function () {
        var airportList = $('#airport-list');
            airportList.html('');
            airportList.append('<option value=""></option>');
        var sortedSites = sites.sort(function(a, b){ return (a.Code < b.Code ? -1 : 1); });
        for (var i in sortedSites) {
            var newOption = $('<option value="' + sites[i].Code + '">' + sites[i].Code + '</option>');
            airportList.append(newOption);
        }
    },
    
    siteListChange: function() {
        var ctl = $(this),
            airportCode = ctl.val();
            if(airportCode) {
                var currAirport = _.findWhere(sites, {Code: airportCode});

                globalMarker.setTitle(currAirport.Code);
                globalMarker.setPosition({lat: currAirport.Latitude, lng: currAirport.Longitude});

                globalMap.panTo({lat: currAirport.Latitude, lng: currAirport.Longitude});
                
                globalInfo.setContent(MapFcns.markerInfo(currAirport));
            }
    },

    markerInfo: function(airport) {
        var contentString = 
            '<div id="airport-settings">'+
                '<div id="setting-labels">'+
                    '<div>Code</div>'+
                    '<div>City</div>'+
                    '<div>State</div>'+
                    '<div>Full Name</div>'+
                    '<div>Latitude</div>'+
                    '<div>Longitude</div>'+
                '</div>'+
                '<div id="setting-value">'+
                    '<div id="setting-code">' + airport.Code + '</div>'+
                    '<div id="setting-city">' + airport.City + '</div>'+
                    '<div id="setting-state">' + airport.State + '</div>'+
                    '<div id="setting-name">' + airport.FullSiteName + '</div>'+
                    '<div id="setting-lat">' + airport.Latitude + '</div>'+
                    '<div id="setting-long">' + airport.Longitude + '</div>'+
                '</div>'+
            '</div>';

        return contentString;
    },

    airportControl: function(controlDiv) {
        var controlUI = $('<div id="airport-controls">Airports: </div>');
        var listControl = $('<select id="airport-list"><option value=""></option></select>');
        listControl.change(MapFcns.siteListChange);
        controlUI.append(listControl);

        var sortedSites = sites.sort(function(a, b){ return (a.City < b.City ? -1 : 1); });
        for (var i in sortedSites) {
            var newOption = $('<option value="' + sites[i].Code + '">' + sites[i].City + '</option>');
            listControl.append(newOption);
        }
        $(controlDiv).append(controlUI);
    }
}


$(function() {
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

    var centerControlDiv = document.createElement('div');
    centerControlDiv.id = 'center-control';
    MapFcns.airportControl(centerControlDiv);
    centerControlDiv.index = 1;
    globalMap.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

    globalInfo = new google.maps.InfoWindow();

    globalMarker = new google.maps.Marker({
        map: globalMap,
        icon: "airport-pin-filled.png",
    });
    globalMarker.addListener('click', function() {
        globalInfo.open(globalMap, globalMarker);
    });

    // center the map if the user allows geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            globalMap.panTo({lat: position.coords.latitude, lng: position.coords.longitude});
        });
    }
}