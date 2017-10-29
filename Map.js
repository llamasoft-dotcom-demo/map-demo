var globalMap;
var markers = [];

$(function() {

var MapFcns = {
    loadSiteList: function () {
        var airportList = $('#airport-list');
            airportList.html('');
            airportList.append('<option value=""></option>');
            var sortedSites = _.sortBy(sites, 'Code');
        for (var i in sortedSites) {
            var newOption = $('<option value="' + sortedSites[i].Code + '">' + sortedSites[i].Code + '</option>');
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

                var ExistingMarker = _.findWhere(markers, {title: airportCode});

                if(typeof ExistingMarker === "undefined"){
                    var marker = new google.maps.Marker({
                            position: {lat: currAirport.Latitude, lng: currAirport.Longitude},
                            map: globalMap,
                            title: currAirport.Code
                        });

                        markers.push(marker);

                        globalMap.panTo(marker.position);
                        globalMap.setZoom(6);

                        google.maps.event.addListener(marker, "rightclick", function (point) { id = this.__gm_id; removeMarker(marker) });

                }
                else {
                        globalMap.panTo(ExistingMarker.position);
                        globalMap.setZoom(6);    
                }   

            }
    }
}


var removeMarker = function(marker) {
    var isDelete = confirm("Delete Marker?");

    if(isDelete == true)
    {
         marker.setMap(null);
         markers.pop(marker);
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