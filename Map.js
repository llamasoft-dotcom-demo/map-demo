var globalMap;


$(function() {
    var markers = [];
    var MapFcns = {
        loadSiteList: function (sortBy) {
            //populates <select> elements with data from siteData.js
            var airportList = $('#airport-by-'+sortBy);
            sites = sites.sort(function(a, b){
                var siteA = a[sortBy];
                var siteB = b[sortBy];
                if (siteA < siteB){
                    return -1
                }
                if (siteB < siteA){
                    return 1
                }
                return 0;
            });

            airportList.html('');
            airportList.append('<option value=""></option>');

            for (var i in sites) {
                if (sortBy === 'Code') {
                    var newOption = $('<option value="' + sites[i].Code + '">' + sites[i].Code + ' - ' + sites[i].City + ', ' + sites[i].State + '</option>');
                } else {
                    var newOption = $('<option value="' + sites[i].Code + '">' + sites[i].City + ', ' + sites[i].State + ' - ' + sites[i].Code + '</option>');
                }
                airportList.append(newOption);
            }
        },
    
        siteListChange: function() {
        //runs when a <select> element is changed
            var ctl = $(this), airportCode = ctl.val();
            if(airportCode) {
                var currAirport = _.findWhere(sites, {Code: airportCode});
                $('#setting-code').text(currAirport.Code);
                $('#setting-city').text(currAirport.City);
                $('#setting-state').text(currAirport.State);
                $('#setting-full-name').text(currAirport.FullSiteName.substring(12));
                $('#setting-lat').text(currAirport.Latitude);
                $('#setting-long').text(currAirport.Longitude);
                var marker = new google.maps.Marker({
                    position: {lat: currAirport.Latitude, lng: currAirport.Longitude},
                    map: globalMap,
                    title: currAirport.Code
                });
                //check array 'markers' to see if this airport Code
                //has already been selected.
                //If so, make the new marker go away!
                var i = 0;
                do {
                    if (markers[i] === marker.title){
                        marker.setMap(null);
                        break;
                    }
                    i++;
                } while(i <markers.length);

                markers.push(marker.title);
                console.log(markers);
                //on click, the marker disappears
                marker.addListener('click', function() {
                    marker.setVisible(false);
                    //find and remove all references to this airportCode
                    //in the markers array so the airportCode can be
                    //added back in again later
                    //and remove it from the ul#code-list
                    markers.forEach(function(airportCode){
                        //remove from markers array
                        if (airportCode === marker.title) {
                            var badIndex = markers.indexOf(airportCode);
                            markers.splice(badIndex, 1)
                        }
                        //remove li element from #code-list
                        
                    }); 
                    var match = $('.code-list-item:contains("'+ marker.title +'")');
                    match.detach();
                });
                    

                var checker = 0;
                markers.forEach(function(code){
                    if (code === marker.title){
                        checker++;
                    }

                });
                if (checker === 1){
                    //add new element to the ul#code-list if
                    //that airport hasn't been added yet
                    var newCode = $('<li class="code-list-item">' + marker.title + '</li>');
                    $('#code-list').append(newCode);
                    $('.code-list-item').on('click', function(){
                        //if you click a li, center the map on assoc. airport and
                        //populate the #airport-settings with its information
                        var location = _.findWhere(sites, {Code: $(this).text()})
                        var newLat = Number(location.Latitude);
                        var newLong = Number(location.Longitude);
                        globalMap.setCenter({lat: newLat, lng: newLong})
                        $('#setting-code').text(location.Code);
                        $('#setting-city').text(location.City);
                        $('#setting-state').text(location.State);
                        $('#setting-full-name').text(location.FullSiteName.substring(12));
                        $('#setting-lat').text(location.Latitude);
                        $('#setting-long').text(location.Longitude);
                    });
                }    
            }
        }
    }

    $('#locate').on('click', function(){
        var newLat = Number($('#setting-lat').text());
        var newLong = Number($('#setting-long').text());
        globalMap.setCenter({lat: newLat, lng: newLong});
    });

    // function addToList(marker){
    //         Array.prototype.notContains = function (item) {
    //             for (var i in this) {
    //                 if (this[i] == item) return false;
    //             }
    //             return true;
    //         }
    //         if (markers.notContains(code)) {
    //             markers.push(code);
    //         }
            
            
    //     }



    //added a parameter to function MapFcns.loadSiteList 
    //to easily create a second <select> element 
    //to search by city name rather than airport code, because some
    //airports have unintuitive codes (e.g. Seattle = BFI)
    //this will improve the UX
    MapFcns.loadSiteList('Code');
    MapFcns.loadSiteList('City');

    $('#airport-by-Code').change(MapFcns.siteListChange);
    $('#airport-by-City').change(MapFcns.siteListChange);

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

