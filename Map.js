var globalMap;

$(function() {

var MapFcns = {
    loadSiteList: function () {

        sites = _.sortBy(sites, 'Code');

        var airportList = $('#airport-list');
            airportList.html('');
            airportList.append('<option value=""></option>');
        var cityList = $('#city-list');
            cityList.html('');
            cityList.append('<option value=""></option>');

        for (var i in sites) {
            var newOption = $('<option value="' + sites[i].Code + '">' + sites[i].Code + '</option>');
            airportList.append(newOption);
        }
        for (var i in sites) {
            var newOption = $('<option value="' + sites[i].Code + '">' + sites[i].City + '</option>');
            cityList.append(newOption);
        }
    },

    siteListChange: function() {
        var ctl = $("#city-input"),
            airportCode = ctl.val();
            if(airportCode) {
                var currAirport = _.findWhere(sites, {Code: airportCode});

                var marker = new google.maps.Marker({
                    title: currAirport.City,
                    animation: google.maps.Animation.DROP,
                    position: {lat: currAirport.Latitude, lng: currAirport.Longitude},
                    map: globalMap,
                    label: {
                        fontWeight: "bolder",
                        text: currAirport.Code
                    }
                });

                var ind = currAirport.FullSiteName.lastIndexOf('_');
                var FullName = currAirport.FullSiteName.slice(ind + 1);

                var loc = new google.maps.LatLng({lat: currAirport.Latitude, lng: currAirport.Longitude});
                globalMap.panTo(loc);

                var cont = "<p><b>" + currAirport.Code + "</b><br>" + FullName + "<br>" + currAirport.City + ", " + currAirport.State;
                cont += "<br>(" + currAirport.Latitude + ", " + currAirport.Longitude + ")";

                var iwindow = new google.maps.InfoWindow({
                    content: cont,
                });

                google.maps.event.addListener(marker, 'click', function() {
                    iwindow.open(globalMap, marker);
                });
                google.maps.event.addListener(marker, 'dblclick', function() {
                    marker.setVisible(false)
                    iwindow.close();
                });

            }
    }
}

MapFcns.loadSiteList();
    $('.btn.btn-success').click(MapFcns.siteListChange);

    $('#exercise-toggle').click(function() {
        var  toggleCtl = $(this),
             toggleVal = toggleCtl.text();
        if (toggleVal == '-') {
            toggleCtl.text('+');
            $('#exercise-instructions').hide();
            $('#map').css("display", "block");
            $('#map').css("margin-top", "2%");
            $('#map').css("margin-left", "5%");
        } else {
            toggleCtl.text('-');
            $('#exercise-instructions').show();
            $('#map').css("display", "inline-block");
            $('#map').css("margin", "4% auto auto auto");
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
