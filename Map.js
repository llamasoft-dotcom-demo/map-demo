/// <reference path="Map.html" />
var globalMap;
var markers = {};

$(function() {

var MapFcns = {
    loadSiteList: function () {
        var airportList = $('#airport-list');
        //airportList.html('');
        
        for (var i in sites) {
            // if 'FullSiteName' has that funky prefix, remove it and store it in 'AirportName'
            if (sites[i].FullSiteName.indexOf("_" + sites[i].Code + "_") >= 0) {    
                sites[i]["AirportName"] = sites[i].FullSiteName.substr(sites[i].FullSiteName.indexOf("_" + sites[i].Code + "_") + 5);
            }
            else {
                sites[i]["AirportName"] = sites[i].FullSiteName;
            }
            sites[i]["CityStateLabel"] = sites[i].City + (sites[i].City.indexOf(',') < 0 ? ", " + sites[i].State : "");
            var newOption = $('<option value="' + sites[i].Code + '">' + sites[i].CityStateLabel
                + " (" + sites[i].Code + ")" + '</option>');
            newOption.data("airport_data", sites[i]);
            airportList.append(newOption);
        }
        var option_list = $(airportList).children();
        option_list.detach();
        option_list.sort(function (a, b) {  //sort list by City
            return ($(b).text() < $(a).text()) ? 1 : -1;
        });
        airportList.prepend("<option value='' disabled='disabled'>Select an Airport</option>");
        airportList.append(option_list);
        airportList.val(null);
    },

    updateCount: function () {
        $("div.counter").text($("div.airport").length);
    },

    siteListChange: function() {
        var ctl = $(this);
        google.maps.event.clearListeners(globalMap, 'bounds_changed');
        globalMap.addListener('bounds_changed', function () {
            MapFcns.configureAirports();
        });
        var airport_data = ctl.children("option[value='" + ctl.val() + "']").data("airport_data");
        if (airport_data) {
                //var currAirport = _.findWhere(sites, {Code: airportCode});
            //$('#setting-code').text(airport_data.Code);
            //$('#setting-city').text(airport_data.City);
            //$('#setting-state').text(airport_data.State);
            //$('#setting-fullname').text(airport_data.AirportName);
            //$('#setting-lat').text(airport_data.Latitude);
            //$('#setting-long').text(airport_data.Longitude);

            var contentString = "<div class='name' title='" + airport_data.AirportName + "' style='font-weight:bold;'>" // content of marker infowindow
                + airport_data.AirportName.replace("International", "Intl") + "</div>"
                +"<div class='city'>" + airport_data.CityStateLabel + " (" + airport_data.Code + ")</div>"
                + "<div class='coords'><div class='lat' style='float:left'>" + airport_data.Latitude
                + " lat</div><div class='lon' style='float:left; margin-left:1em;'>" + airport_data.Longitude + " lon</div></div>"
            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });
            var marker = new google.maps.Marker({
                position: { lat: airport_data.Latitude, lng: airport_data.Longitude },
                map: globalMap,
                title: airport_data.Code,
                icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            });
            marker.id = airport_data.Code;
            //marker.addListener('click', function () {
            //    infowindow.open(globalMap, marker);
            //});

            google.maps.event.addListener(marker, 'click', function () {
                if (!marker.open) {
                    infowindow.open(globalMap, marker);
                    marker.open = true;
                }
                else {
                    infowindow.close();
                    marker.open = false;
                }
                google.maps.event.addListener(globalMap, 'click', function () {
                    infowindow.close();
                    marker.open = false;
                });
            });
            markers["airport_" + airport_data.Code] = marker;
            MapFcns.addSelectedAirport(airport_data);
        }
    },

    addSelectedAirport: function (airport_data) {       // add airport to list of selected airports
        var airport = document.createElement("div");
        $(airport).attr("id", "airport_" + airport_data.Code);
        $(airport).addClass("airport");
        $(airport).data(airport_data);
        $(airport).append("<div class='name' title='" + airport_data.AirportName + "'>" + airport_data.AirportName + "</div><div class='remove_airport'>x</div>"
            + "<div class='city'>" + airport_data.CityStateLabel + " (" + airport_data.Code + ")</div>"
            + "<div class='coords'><div class='lat'>" + airport_data.Latitude + " lat</div><div class='lon'>" + airport_data.Longitude + " lon</div></div>"
            + "<div class=controls><div class='center' title='center map on airport'><i class='fa fa-bullseye'></i></div><div class='show include' title='fit into map view'><i class='fa fa-map-marker'></i></div></div>");

        // set click events for three controls in 'airport' div
        $(airport).find("div.remove_airport").click(function () {
            MapFcns.removeAirport($(this).closest("div.airport"));
        });
        $(airport).find("div.center").click(function () {   // set click event for 'center' button
            MapFcns.centerOnAirport($(this).closest("div.airport"));
        });
        $(airport).find("div.show").click(function () {     // set click event for 'show' button (includes marker in map view)
            $(this).toggleClass("include");
            MapFcns.lassoAirports();
        });
        $("#sel-airport-container").append(airport);

        // disable option in select for this airport so it cannot be added twice
        $("#airport-list").children("option[value='" + airport_data.Code + "']").attr("disabled", "disabled");
        MapFcns.updateCount();
        MapFcns.lassoAirports();
    },

    centerOnAirport: function (airport) {   // center map on selected airport
        airport_code = airport.data("Code");
        marker = markers[airport.attr("id")];
        globalMap.setCenter(marker.position);
    },

    lassoAirports: function () {        //fits all airports flagged to "show" into map view
        var minlat = 0, maxlat = 0, minlon = 0, maxlon = 0;
        var updateBounds = ($("div.show.include").length > 0);
        $("div.show.include").each(function (index, show) {
            airport_data = $(show).closest("div.airport").data();
            if (index === 0) {
                minlat = airport_data.Latitude;
                maxlat = airport_data.Latitude;
                minlon = airport_data.Longitude;
                maxlon = airport_data.Longitude;
            }
            minlat = minlat < airport_data.Latitude ? minlat : airport_data.Latitude;
            maxlat = maxlat > airport_data.Latitude ? maxlat : airport_data.Latitude;
            minlon = minlon < airport_data.Longitude ? minlon : airport_data.Longitude;
            maxlon = maxlon > airport_data.Longitude ? maxlon : airport_data.Longitude;
        });
        if (updateBounds) {
            globalMap.fitBounds({ east: maxlon, south: minlat, west: minlon, north: maxlat });
            var current_zoom = globalMap.getZoom();
            if (current_zoom > 11) {
                globalMap.setZoom(11);
            }
        }
    },

    configureAirports: function () {
        $("div.show.include").each(function (index, show) {     //if airport falls out of view due to user, un "show" the aiport.
            airport_data = $(show).closest("div.airport").data();
            var marker = markers["airport_" + airport_data.Code];
            if (!marker || !globalMap.getBounds().contains(marker.getPosition())) {
                $(show).removeClass("include");
            }
        });
    },

    removeAirport: function (airport) {
        airport_code = airport.data("Code");
        marker = markers[airport.attr("id")];
        marker.setMap(null);
        airport.fadeOut("fast",
            function () {
                airport.remove();
                MapFcns.updateCount();
                // enable airport in select list so user can add again if needed
                $("#airport-list").children("option[value='" + airport_code + "']").removeAttr("disabled");
                if ($("#airport-list").val() === airport_code) {
                    $("#airport-list").val("");
                }
            });
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
    $("#airport-controls").append("<div class='list_toggle show_list' title='show/hide list'>"  //add button to show/hide airport list
        + "<i class='fa fa-plane'></i><div class='counter'>0</div></div>");
    $("div.list_toggle").click(function () {
        $(this).toggleClass("show_list");
        $("#exercise").toggleClass("show_list");
        google.maps.event.trigger(globalMap, 'resize');     // repaint map with new div size
        MapFcns.lassoAirports();                            //fit bounds to airports
    });
});
    
function  initMap() {
    // Callback function to create a map object and specify the DOM element for display.
    var myStyle = [{ "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#444444" }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2f2f2" }] }, { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": 45 }] }, { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "simplified" }] }, { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#46bcec" }, { "visibility": "on" }, { "saturation": -75 }] }];
    globalMap = new google.maps.Map(document.getElementById('airport-map'), {
    center: {lat: 42.2814, lng: -83.7483},
    scrollwheel: true,
    zoom: 6,
    styles: myStyle
    });
}