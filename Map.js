var globalMap;
var autoCompleteData;
var markers;
$(function() {
    autoCompleteData = new Array();
    markers = new Array();
    $("#gridTable1").hide();

    for (i = 0; i < sites.length; i++) {
        var newsite = { label: sites[i].City + ' - ' + sites[i].Code, value: sites[i].Code };
        autoCompleteData.push(newsite);
    }
    _.sortBy(autoCompleteData, 'label');


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
    $("#matterSearchTerm").autocomplete({
        source: autoCompleteData,
        minLength: 1,
        select: function (event, ui) {

            var currAirport = _.findWhere(sites, { Code: ui.item.value });
            $('#setting-code').text(currAirport.Code);
            $('#setting-city').text(currAirport.City);
            $('#setting-state').text(currAirport.State);
            $('#setting-name').text(currAirport.FullSiteName.substring(currAirport.FullSiteName.lastIndexOf('_') + 1)); // Trimming start because always the same and makes it less readable.
            $('#setting-lat').text(currAirport.Latitude);
            $('#setting-long').text(currAirport.Longitude);

            var latLng = { lat: currAirport.Latitude, lng: currAirport.Longitude }
            var marker = _.findWhere(markers, { title: currAirport.Code });
            if (typeof marker == 'undefined') {
                
                var marker = new google.maps.Marker({
                    position: latLng,
                    map: globalMap,
                    title: currAirport.Code
                });
                markers.push(marker);
                $("#gridTable1").show();
            }
            
            globalMap.setCenter(latLng);
        }
    });
    $("#btnRemove").click(function () {

        var marker = _.findWhere(markers, { title: $('#setting-code').text() });
        marker.setMap(null);
        markers.pop(marker);
        if (markers.length == 0) {
            $("#gridTable1").hide();
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