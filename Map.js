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
        var ctl = $(this);
        airportCode = ctl.val();
        if (airportCode) {
            MapFcns.doSiteChange(airportCode);
        }
    },

    doSiteChange: function(airportCode){
        var currAirport = _.findWhere(sites, {Code: airportCode});
        $('#setting-code').text(currAirport.Code);
        $('#setting-city').text(currAirport.City);
        $('#setting-state').text(currAirport.State);
        $('#setting-lat').text(currAirport.Latitude);
        $('#setting-long').text(currAirport.Longitude);

        // this one is rather large...and since I'm moving the whole table to right of the map..protect against overflow
        // also I'm peeling off the AIRPORT_CODE_X part and just making X...the rest seems like its just taking up space for no reason
        var useName = currAirport.FullSiteName.split('_')[2];
        var fullNameElement = document.createElement('p');
        fullNameElement.innerHTML = useName;
        $('#setting-fullname').empty();
        $('#setting-fullname').append(fullNameElement);

        var pos = {lat: currAirport.Latitude, lng: currAirport.Longitude};

        // only add a marker if its not already there
        if (MapFcns.markerVault.indexOf(currAirport.Code) == -1){
            var marker = new google.maps.Marker({
                position: pos,
                map: globalMap,
                title: currAirport.Code
            });

            // add a listener to the click event here...for now, just make this remove the marker
            marker.addListener('click', function(){
                marker.setMap(null);
                // remove from the vault as well
                MapFcns.removeVault(currAirport.Code, 1);
            });

            // add to the marker vault to prevent dups 
            MapFcns.addVault(currAirport.Code);
        }

        // center the map to what just got clicked
        globalMap.setCenter(pos);

        // since there are muliple ways to get in here now, make sure the airport code is selected in the drop down
        var airportList = $('#airport-list').val(currAirport.Code);
    },

    addVault: function(code){
        this.markerVault.push(code);
        this.updateSelectedList();
    },

    removeVault: function(code){
        this.markerVault.splice(this.markerVault.indexOf(code), 1);
        this.updateSelectedList();
    },

    updateSelectedList: function(){
        // for ease..just recreate the list when this is called
        var sortedVault = _.sortBy(this.markerVault, function(i){ return i.toLowerCase(); });
        
        $('#airport-recents-list').empty();
        _.each(sortedVault, function(i){
            var newListElement = document.createElement('li');
            newListElement.innerHTML = i;
            // add a listener that will go into the siteListChange function
            $(newListElement).click(function(){ MapFcns.doSiteChange(i) });
            $('#airport-recents-list').append(newListElement);
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