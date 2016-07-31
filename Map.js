var globalMap;
var markers = [];

$(function() {

var MapFcns = {
    loadSiteList: function () {
        var airportList = $('#airport-list');
            airportList.html('');
            airportList.append('<option value=""></option>');
            sites = _.sortBy(sites,'Code');//sort sites array by Code
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
                $('#setting-full-name').text(currAirport.FullSiteName);//id of setting name was used twice
                $('#setting-lat').text(currAirport.Latitude);
                $('#setting-long').text(currAirport.Longitude);

// *** Center map based off of drop down
                globalMap = new google.maps.Map(document.getElementById('airport-map'), {
                    center: {lat: currAirport.Latitude, lng: currAirport.Longitude},
                    scrollwheel: true,
                    zoom: 6
                  });
                
                var marker = new google.maps.Marker({
                    position: {lat: currAirport.Latitude, lng: currAirport.Longitude},
                    map: globalMap,
                    title: currAirport.Code
                });
            }
            markers.push(marker);//store marker in array

        
    },

  
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



// remove markers in array from map view
  function removeMarkers(){
        for(i=0; i<markers.length; i++){
            markers[i].setMap(null);
        }
        $('#setting-code').text("");
        $('#setting-city').text("");
        $('#setting-state').text("");
        $('#setting-full-name').text("");
        $('#setting-lat').text("");
        $('#setting-long').text("");
        initMap();
    }

    
function  initMap() {
  // Callback function to create a map object and specify the DOM element for display.
  globalMap = new google.maps.Map(document.getElementById('airport-map'), {
    center: {lat: 42.2814, lng: -83.7483},
    scrollwheel: true,
    zoom: 6
  });
  
}

