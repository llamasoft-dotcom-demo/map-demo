var globalMap;
var activeMarkers = [];
$(function() {

var MapFcns = {
    loadSiteList: function () {
        var airportList = $('#airport-list');
            airportList.html('');
            airportList.append('<option value=""></option>');
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
                $('#setting-fullname').text(currAirport.FullSiteName);
                $('#setting-lat').text(currAirport.Latitude);
                $('#setting-long').text(currAirport.Longitude);
                if(contains(currAirport.Code) !== -1){
                   var position ={
                    lat: currAirport.Latitude,
                    lng: currAirport.Longitude
                   } 
                   globalMap.panTo(position)
                }
                else{
                var marker = new google.maps.Marker({
                    position: {lat: currAirport.Latitude, lng: currAirport.Longitude},
                    map: globalMap,
                    title: currAirport.Code,

                        });
                activeMarkers.push(marker);
                globalMap.panTo(marker.position);

 google.maps.event.addListener(marker, "rightclick", function(){
   var index = activeMarkers.indexOf(marker);
   activeMarkers.splice(index, 1);
    marker.setMap(null);

 });
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





function contains(airportCode){
    var length = activeMarkers.length;
    for(var i = 0; i < length; i++){
        if(airportCode === activeMarkers[i].title){
            return i;
        }
    }
    return -1;
}


function  initMap() {
  // Callback function to create a map object and specify the DOM element for display.
  globalMap = new google.maps.Map(document.getElementById('airport-map'), {
    center: {lat: 42.2814, lng: -83.7483},
    scrollwheel: true,
    zoom: 6
  });
  
    }