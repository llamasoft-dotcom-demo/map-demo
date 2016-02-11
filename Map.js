var globalMap;

$(function() {
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

var MapData ={
    lastInfoWindow: null,
    markers: []
}

var MapFcns = {
    loadSiteList: function () {
        // REQ 3: Sort airports
        var sorted = _.sortBy(sites, 'Code');
        var airportList = $('#airport-list');
            airportList.html('');
            airportList.append('<option value=""></option>');
        for (var i in sorted) {
            var newOption = $('<option value="' + sorted[i].Code + '">' + sorted[i].Code + '</option>');
            airportList.append(newOption);
        }
    },
    
    siteListChange: function() {
        var ctl = $(this);
        var airportCode = ctl.val();
        if(airportCode) {
            var currAirport = _.findWhere(sites, {Code: airportCode});
            MapFcns.setupMarker(currAirport);
        }
    },
    
    useExistingMarker: function(currAirport){
        var marker = _.findWhere(MapData.markers, {title: currAirport.Code});
        if(marker == null || marker.length == 0) return false;
        
        // Show existing marker with info.
        google.maps.event.trigger(marker, 'click', {
            latLng: new google.maps.LatLng(0, 0)
        });
        return true;
    },
    
    setupMarker: function(currAirport){
        if(MapFcns.useExistingMarker(currAirport)) return;
    
        var marker = new google.maps.Marker({
            position: {lat: currAirport.Latitude, lng: currAirport.Longitude},
            map: globalMap,
            title: currAirport.Code
        });
        
        MapData.markers.push(marker);
        
        // REQ 2: Remove marker.
        marker.addListener('dblclick', function(e){
            marker.setMap(null);
            var index = MapData.markers.indexOf(marker);
            if(index < 0) return;
            MapData.markers.splice(index, 1);
        });
        
        var showedWindow = MapFcns.addInfoWindow(currAirport, marker);
        
        if(showedWindow) return;
        globalMap.setCenter(marker.getPosition());
    },
    
    // REQ 1: Show all data in a space efficient way using Map API info window.
    // Returns whether window was opened.
    addInfoWindow: function(currAirport, marker){
        MapFcns.closeLastInfo();
        var index = _.lastIndexOf(currAirport.FullSiteName, '_');
        var fullName = currAirport.FullSiteName.substring(index + 1);
        var infoContent = 
            '<div class="table-responsive info-window"><table class="table">' +
            '<caption>' + fullName + '</caption><tbody>' +
            MapFcns.getTableRow('Code', currAirport.Code) +
            MapFcns.getTableRow('City', currAirport.City) + 
            MapFcns.getTableRow('Latitude', currAirport.Latitude) + 
            MapFcns.getTableRow('Longitude', currAirport.Longitude) +
            '</tbody></table></div>';
            
        var infoWindow = new google.maps.InfoWindow({
            content: infoContent
        });
        
        marker.addListener('click', function(){
            MapFcns.closeLastInfo();    
            infoWindow.open(globalMap, marker);
        });
        
        if(!$('#show-checkbox').is(':checked')) return false;
        
        infoWindow.open(globalMap, marker);
        MapData.lastInfoWindow = infoWindow;
        return true;
    },
    
    closeLastInfo: function(){
        if(MapData.lastInfoWindow == null) return;
        MapData.lastInfoWindow.close();
    },
    
    getTableRow: function(rowHeader, rowData){
        return '<tr><th scope="row">' + rowHeader + '</th><td>' + rowData + '</td></tr>';
    },
}
   
function  initMap() {
  // Callback function to create a map object and specify the DOM element for display.
  globalMap = new google.maps.Map(document.getElementById('airport-map'), {
    center: {lat: 42.2814, lng: -83.7483},
    scrollwheel: true,
    zoom: 6
  });
}

