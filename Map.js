var globalMap;

$(function() {

var MapFcns = {
    // keep a list of already added markers so the user can't add duplicates
    markerVault: [],

    loadSiteList: function () {
        var airportList = $('#airport-list');
            airportList.html('');
            airportList.append('<option value=""></option>');

        // sort the array first
        var sortedSites = _.sortBy(sites, function(i){ return i.Code.toLowerCase(); });
        _.each(sortedSites, function(i){
            var newOption = $('<option value="' + i.Code + '">' + i.Code + '</option>');
            airportList.append(newOption);
        });
    },
    
    siteListChange: function() {
        var ctl = $(this),
            airportCode = ctl.val();
            if(airportCode) {
                var currAirport = _.findWhere(sites, {Code: airportCode});
                $('#setting-code').text(currAirport.Code);
                $('#setting-city').text(currAirport.City);
                $('#setting-state').text(currAirport.State);
                $('#setting-fullname').text(currAirport.FullSiteName);
                $('#setting-lat').text(currAirport.Latitude);
                $('#setting-long').text(currAirport.Longitude);
                
                // only add a marker if its not already there
                if (MapFcns.markerVault.indexOf(currAirport.Code) == -1){
                    var pos = {lat: currAirport.Latitude, lng: currAirport.Longitude};
                    var marker = new google.maps.Marker({
                        position: pos,
                        map: globalMap,
                        title: currAirport.Code
                    });

                    // add a listener to the click event here...for now, just make this remove the marker
                    marker.addListener('click', function(){
                        marker.setMap(null);
                        // remove from the vault as well
                        MapFcns.markerVault.splice(MapFcns.markerVault.indexOf(currAirport.Code), 1);
                    });

                    // add to the marker vault to prevent dups 
                    MapFcns.markerVault.push(currAirport.Code);

                    // center the map to what just got added
                    globalMap.setCenter(pos);
                }
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







    
function  initMap() {
  // Callback function to create a map object and specify the DOM element for display.
  globalMap = new google.maps.Map(document.getElementById('airport-map'), {
    center: {lat: 42.2814, lng: -83.7483},
    scrollwheel: true,
    zoom: 6
  });
  
    }