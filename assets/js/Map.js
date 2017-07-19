var globalMap;
var markers = [];
$(function() {

var MapFcns = {
    
    sortSites: function(a,b)
    {
        if(a.Code < b.Code)
            return -1;
        if(a.Code > b.Code)
            return 1;
        return 0;
    },

    loadSiteList : function()
    {
        var airportList = $('#airport-list-group');
        sites.sort(MapFcns.sortSites);
        for(var i in sites)
        {
            var airportListItem = $('<a class="list-group-item" href="#" onclick="toggleMarker(\''+ sites[i].Code+'\',true)" id="'+ sites[i].Code+'-list-item">' + sites[i].Code + '</a>' );
            airportList.append(airportListItem);
        }
    }
}

MapFcns.loadSiteList();
$(function () {
  $('[data-toggle="popover"]').popover()
});
$('#clearall').on('click',function()
{
    removeAll();
    showAllListItems();
});
$('#selectall').on('click', function()
{
    removeAll();
    addAll();
});
});
// add markers for all airports
function addAll()
{
    for(var i in sites)
    {
        enableListItem(sites[i].Code);
        addMarker(sites[i]);
    }
}
// show entire list of airports
function showAllListItems()
{
    var li = $('#airport-list-group').find('a');
    var filter = $('#searchbox').val();
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        var code = li[i].text;
        li[i].style.display = '';
    }
}
//search airports in list
function search()
{
    var li = $('#airport-list-group').find('a');
    var filter = $('#searchbox').val();
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        var code = li[i].text;
        if(code.toUpperCase().indexOf(filter.toUpperCase()) > -1)
        {
           li[i].style.display = '';
        }
        else
        {
            li[i].style.display = 'none';
        }
    }
}
// remove all markers from map and remove active status of list items
function removeAll()
{
    for(var i = 0; i < markers.length;i++)
    {
        markers[i].setMap(null);
        disableListItem(markers[i].title);
    }
    markers = [];
}
// set active status of list item by airport code
function enableListItem(code)
{
    if($('#airport-list-group #'+code+'-list-item').length)
    {
        var item = $('#airport-list-group #'+code+'-list-item');
        if(!item.hasClass('active'))
            item.addClass('active');
    }
}
// Remove Active status of list item by airport code
function disableListItem(code)
{
    if($('#airport-list-group #'+code+'-list-item').length)
    {
        var item = $('#airport-list-group #'+code+'-list-item');
        if(item.hasClass('active'))
            item.removeClass('active');
    }
}
// Get index of the marker in markers array by airport code.
function getIndexByCode(code)
{
    for(var i = 0; i < markers.length;i++)
    {
        if(markers[i].title == code)
        {
            return i;
        }
    }
    return -1;
}
// Toggle active status of list item
function toggleListItem(code)
{
    if($('#airport-list-group #'+code+'-list-item').length)
    {
        var item = $('#airport-list-group #'+code+'-list-item');
        if(item.hasClass('active'))
        {
            item.removeClass('active');
        }
        else
        {
            item.addClass('active');
        }
    }
}
// Toggle Marker. If the marker currently exists, remove it.  If not, add it.
function toggleMarker(code, loadTable)
{
	var loadDetails = false;
	if(loadTable)
	{
		loadDetails = true;
	}
	
    if($('#airport-list-group #'+code+'-list-item').length)
    {
        var item = $('#airport-list-group #'+code+'-list-item');
        if(item.hasClass('active'))
        {
            item.removeClass('active');
            removeMarker(code);
        }
        else
        {
            item.addClass('active');
            airportCode = item.text();
            if(airportCode) 
            {
                var currAirport = _.findWhere(sites, {Code: airportCode});
                addMarker(currAirport);
                if(loadDetails == true)
                {
                    $('#setting-code').text(currAirport.Code);
                    $('#setting-city').text(currAirport.City);
                    $('#setting-state').text(currAirport.State);
                    $('#setting-fullname').text(formatName(currAirport.FullSiteName));
                    $('#setting-lat').text(currAirport.Latitude);
                    $('#setting-long').text(currAirport.Longitude);
                }
            }
        }
    }   
}
// Add Marker and associated InfoWindow to Map
function addMarker(currAirport)
{
    var p = {lat: currAirport.Latitude, lng: currAirport.Longitude}
    var marker = new google.maps.Marker({
                    position: p,
                    map: globalMap,
                    title: currAirport.Code
                });
    var contentText ='<div id="infoWidowDetails">' +
                        '<div class="row">'+
                            '<div class="col-md-4">'+
                                '<strong>Code:</strong>'+
                            '</div>'+
                        '<div class="col-md-8">'+ currAirport.Code +'</div>'+
                        '</div>'+
                        '<div class="row">'+
                            '<div class="col-md-4">'+
                              '<strong>City:</strong>'+
                            '</div>'+
                            '<div class="col-md-8">'+ currAirport.City +'</div>'+
                        '</div>'+
                        '<div class="row">'+
                            '<div class="col-md-4">'+
                                '<strong>State:</strong>'+
                            '</div>'+
                            '<div class="col-md-8">'+ currAirport.State +'</div>'+
                        '</div>'+
                        '<div class="row">'+
                            '<div class="col-md-4">'+
                                '<strong>Full Name:</strong>'+
                            '</div>'+
                            '<div class="col-md-8">'+ formatName(currAirport.FullSiteName) +'</div>'+
                        '</div>'+
                        '<div class="row">'+
                            '<div class="col-md-4">'+
                                '<strong>Latitude:</strong>'+
                            '</div>'+
                            '<div class="col-md-4">'+ currAirport.Latitude +'</div>'+
                        '</div>'+
                        '<div class="row">'+
                            '<div class="col-md-4">'+
                                '<strong>Longitude:</strong>'+
                            '</div>'+
                            '<div class="col-md-8">'+ currAirport.Longitude +'</div>'+
                        '</div>'+
                    '</div>'+
                    '<a onclick="toggleMarker(\''+currAirport.Code+'\');">Clear Marker<a>' +
                    '</div>';
    var infoWindow = new google.maps.InfoWindow(
                    {
                        content: contentText
                    }
                );
    marker.addListener('click',function()
                {
                    infoWindow.open(globalMap,marker);
                });
    var currentMarker = _.findWhere(markers, {title: currAirport.Code});
    if(!currentMarker)
        markers.push(marker);
    globalMap.setCenter(p);
}
// Remove Marker from Map and from markers array
function removeMarker(code)
{
    var itemIndex = getIndexByCode(code);
    if(itemIndex > -1)
    {
        markers[itemIndex].setMap(null);
        markers.splice(itemIndex,1);
    }
}

// Format full name of airport
function formatName(name)
{
    return name.substring(name.lastIndexOf('_')+1);
}


    
function  initMap() {

    var point = {lat: 42.2814, lng: -83.7483}
  // Callback function to create a map object and specify the DOM element for display.
    globalMap = new google.maps.Map(document.getElementById('airport-map'), {
    center: point ,
    scrollwheel: true,
    zoom: 4
  });
}