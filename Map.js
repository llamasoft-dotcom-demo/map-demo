var globalMap;

function sortByCode(lhs, rhs) {
    if (lhs.Code < rhs.Code)
        return -1;
    else if (lhs.Code > rhs.Code)
        return 1;
    else
        return 0;
}

//keeps track of which markers are currently being displayed on the map
//this keeps duplicate markers from being created
var markerSet = new Object();

$(function() {

    var MapFcns = {
        loadSiteList: function () {
            var airportList = $('#airport-list');
                airportList.html('');
                airportList.append('<option value=""></option>');

            sites.sort(sortByCode);
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
                    $('#setting-fullName').text(currAirport.FullSiteName);
                    $('#setting-lat').text(currAirport.Latitude);
                    $('#setting-long').text(currAirport.Longitude);
                    
                    if (!(currAirport.Code in markerSet) || markerSet[currAirport.Code] != 1) {
                        markerSet[currAirport.Code] = 1;
                        
                        var marker = new google.maps.Marker({
                            position: {lat: currAirport.Latitude, lng: currAirport.Longitude},
                            map: globalMap,
                            title: currAirport.Code
                        });

                        google.maps.event.addListener(marker, "click", function() {
                            markerSet[currAirport.Code] = 0;

                            marker.setMap(null);
                        });

                    }

                    //map pans to marker when it is placed
                    globalMap.panTo(marker.getPosition());
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