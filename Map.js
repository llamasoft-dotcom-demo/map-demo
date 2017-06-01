/*global $, jQuery*/

var globalMap;

$(function () {
    'use strict';
    var MapFcns = {
        loadSiteList: function () {
            var airportList = $('#airport-list');
            airportList.html('');
            airportList.append('<option value=""></option>');
            var sortedSites = _.sortBy(sites,'Code');
            _.each(sortedSites, function(site) { 
                var newOption = $('<option value="' + site.Code + '">' + site.Code + '</option>');
                airportList.append(newOption);
            });
        },

        siteListChange: function() {
            var ctl = $(this),
                airportCode = ctl.val();
            if (airportCode) {
                var currAirport = _.findWhere(sites, {
                    Code: airportCode
                });
                $('#setting-code').text(currAirport.Code);
                $('#setting-city').text(currAirport.City);
                $('#setting-state').text(currAirport.State);
                $('#setting-fullname').text(currAirport.FullSiteName);
                $('#setting-lat').text(currAirport.Latitude);
                $('#setting-long').text(currAirport.Longitude);

                var marker = new google.maps.Marker({
                    position: {
                        lat: currAirport.Latitude,
                        lng: currAirport.Longitude
                    },
                    map: globalMap,
                    title: currAirport.Code
                });
            }
        }
    };


    MapFcns.loadSiteList();
    $('#airport-list').change(MapFcns.siteListChange);
    $('#exercise-toggle').click(function() {
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
    'use strict';
    // Callback function to create a map object and specify the DOM element for display.
    globalMap = new google.maps.Map(document.getElementById('airport-map'), {
        center: {
            lat: 42.2814,
            lng: -83.7483
        },
        scrollwheel: true,
        zoom: 6
    });

}