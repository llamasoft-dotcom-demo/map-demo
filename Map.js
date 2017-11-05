var globalMap;

$(function() {

var markers = [];

// sort alphabetically
function compare(a,b) {
  if (a.Code < b.Code)
    return -1;
  if (a.Code > b.Code)
    return 1;
  return 0;
}

var MapFcns = {
    loadSiteList: function () {
        var airportList = $('#airport-list');
            airportList.html('');
            airportList.append('<option value=""></option>');
        sites.sort(compare);
        for (var i in sites) {
            var newOption = $('<option value="' + sites[i].Code + '">' + sites[i].Code + '</option>');
            airportList.append(newOption);
        }

    },
    
    siteListChange: function() {
        var ctl = $(this);
            airportCode = ctl.val();
            if(airportCode) {
                var currAirport = _.findWhere(sites, {Code: airportCode});
                $('#setting-code').text(currAirport.Code);
                $('#setting-city').text(currAirport.City);
                $('#setting-state').text(currAirport.State);
                $('#setting-long-name').text(currAirport.FullSiteName);
                $('#setting-lat').text(currAirport.Latitude);
                $('#setting-long').text(currAirport.Longitude);
                
                globalMap.panTo(new google.maps.LatLng(currAirport.Latitude, currAirport.Longitude));

                

                // check if marker in saved markers
                var inMarkers = false;
                for (var i in markers){
                    if (markers[i].title == currAirport.Code){
                        inMarkers = true;
                        break;
                    }
                }
                if (! inMarkers){
                    var marker = new google.maps.Marker({
                        position: {lat: currAirport.Latitude, lng: currAirport.Longitude},
                        map: globalMap,
                        title: currAirport.Code
                    });
                    google.maps.event.addListener(marker, 'click', function(event) {
                        this.setMap(null);
                        for (var i in markers){
                            if (markers[i].title == marker.title){
                                markers.splice(i, 1);
                                updateMarkerList();
                                break;
                            }
                        }
                    });
                    markers.push(marker);
                    updateMarkerList();
                }

                
                
                

            }
    }

    
}

$('#clearAll').click(function(){
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers = [];
    updateMarkerList();
});


function updateMarkerList (){
    $("#marked-airports").empty();
    for (var i in markers){
        var title = markers[i].title;
        var lat = markers[i].getPosition().lat();
        var long = markers[i].getPosition().lng();
        $("#marked-airports").append("<li><a href=# id=\""+title+"\" lat=\""+lat+"\" long=\""+long+"\">"+title+"</a></li>");
    }

    for (var i in markers){
        title = markers[i].title;
        $("#"+title).click(function(e){
            e.preventDefault();
            globalMap.panTo(new google.maps.LatLng( $(this).attr("lat"), $(this).attr("long")));
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

});



    
function  initMap() {
  // Callback function to create a map object and specify the DOM element for display.
  globalMap = new google.maps.Map(document.getElementById('airport-map'), {
    center: {lat: 42.2814, lng: -83.7483},
    scrollwheel: true,
    zoom: 6
  });
  
    }