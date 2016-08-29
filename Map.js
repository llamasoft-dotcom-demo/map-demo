var globalMap;
// What a wuss I am
var markers = [];

// jQuery Entry Point/Closure (document ready)
$(function()
{
    // MEMBERS
    var sortedSites = null;

    // MAP CLOSURE
    var MapFcns =
    {
        lastSelectedSiteMarker : null,
        // Below courtesy http://stackoverflow.com/questions/3817812/google-maps-v3-can-i-ensure-smooth-panning-every-time
        // An array of points the current panning action will use
        panPath : [],
        // An array of subsequent panTo actions to take
        panQueue : [],
        // The number of steps that each panTo action will undergo
        STEPS : 50,
        panTo : function(newLat, newLng)
        {
            if (MapFcns.panPath.length > 0)
            {
                // We are already panning...queue this up for next move
                MapFcns.panQueue.push([newLat, newLng]);
            }
            else
            {
                // Lets compute the points we'll use
                MapFcns.panPath.push("LAZY SYNCRONIZED LOCK");  // make length non-zero - 'release' this before calling setTimeout
                var curLat = globalMap.getCenter().lat();
                var curLng = globalMap.getCenter().lng();
                var dLat = (newLat - curLat)/MapFcns.STEPS;
                var dLng = (newLng - curLng)/MapFcns.STEPS;

                for (var i=0; i < MapFcns.STEPS; i++)
                    MapFcns.panPath.push([curLat + dLat * i, curLng + dLng * i]);
                MapFcns.panPath.push([newLat, newLng]);
                MapFcns.panPath.shift();      // LAZY SYNCRONIZED LOCK
                setTimeout(MapFcns.doPan, 20);
            }
        },
        doPan : function()
        {
            var next = MapFcns.panPath.shift();
            if (next != null)
            {
                // Continue our current pan action
                globalMap.panTo( new google.maps.LatLng(next[0], next[1]));
                setTimeout(MapFcns.doPan, 20 );
            }
            else
            {
                // We are finished with this pan - check if there are any queue'd up locations to pan to
                var queued = MapFcns.panQueue.shift();
                if (queued != null)
                    MapFcns.panTo(queued[0], queued[1]);
            }
        },

        loadSiteList: function ()
        {
            if (sortedSites == null)
            {
                var airportList = $('#airport-list');
                airportList.html('');
                // Add an entry for no selection
                airportList.append('<option value=""></option>');
                sortedSites = sites.sort(function (lValue, rValue)
                {
                    if (lValue.Code > rValue.Code)
                        return 1;
                    else if (lValue.Code < rValue.Code)
                        return -1;
                    else // (lValue.Code == rValue.Code)
                        return 0;
                });
            }
            for (var i in sortedSites)
            {
                var newOption = $('<option value="' + sortedSites[i].Code + '">' + sortedSites[i].Code + ':  ' +sortedSites[i].City+', ' + sortedSites[i].State + '</option>');
                airportList.append(newOption);
            }
        },

        siteListChange: function()
        {
            var ctl = $(this);
            var airportCode = ctl.val();
            if (airportCode)
            {
                var currAirport = _.findWhere(sites, {Code: airportCode});
                $('#setting-code').text(currAirport.Code);
                $('#setting-city').text(currAirport.City);
                $('#setting-state').text(currAirport.State);
                $('#setting-fullname').text(currAirport.FullSiteName);
                $('#setting-lat').text(currAirport.Latitude);
                $('#setting-long').text(currAirport.Longitude);

                // This is inefficient - a new map marker is created each call.  Instead we should create one per location, stored in a list augmenting airportList
                var newMarker = new google.maps.Marker({position:
                    {lat: currAirport.Latitude, lng: currAirport.Longitude},
                        map: globalMap,
                        title: currAirport.Code
                    });
                var newMarkerId = markers.push(newMarker) - 1;

                // Create a float-over information window activated on click
                var userReadableAirportName = currAirport.FullSiteName;
                var secondSeparatorPos = currAirport.FullSiteName.lastIndexOf("_")
                if (secondSeparatorPos > 0)
                    userReadableAirportName = currAirport.FullSiteName.substr(secondSeparatorPos+1);
                var infoWindowContent = "<b>"+ userReadableAirportName +" ("+ currAirport.Code + ")</b><br/>" +currAirport.City +", "+ currAirport.State +"<br/>Map coordinates: "+ currAirport.Latitude +" lattitude x "+ currAirport.Longitude + " longitude<br/><br/><button onclick='RemoveMapMarker(" +newMarkerId.toString()+ ");'>Remove</button>"
                var infowindow = new google.maps.InfoWindow({content: infoWindowContent});
                newMarker.addListener('click', function() { infowindow.open(globalMap, newMarker); } );

                MapFcns.lastSelectedSiteMarker = newMarker;
                MapFcns.panTo(currAirport.Latitude, currAirport.Longitude);
            }
        }
    }

    // ENTRY POINT
    MapFcns.loadSiteList();
    $('#airport-list').change(MapFcns.siteListChange);
    $('#exercise-toggle').click(function()
    {
        var  toggleCtl = $(this);
        var  toggleVal = toggleCtl.text();
        if (toggleVal == '-')
        {
            toggleCtl.text('+');
            $('#exercise-instructions').hide();
        }
        else
        {
            toggleCtl.text('-');
            $('#exercise-instructions').show();
        }
    });
});

// Removes a marker from markers from the map.
// targetMarkerId - the element ID of the object in the markers array
function RemoveMapMarker( targetMarkerId )
{
    markers[targetMarkerId].setMap(null);
    markers.splice(targetMarkerId, 1);
}

// Map initialization entry point (called from Google Maps SDK script tag)
function initMap()
{
    // Create map, provide display data, and initial position/GUI config
    globalMap = new google.maps.Map(document.getElementById('airport-map'),
    {
        center: {lat: 42.2814, lng: -83.7483},
        scrollwheel: true,
        zoom: 6
    });
}