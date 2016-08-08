var MarkerFcns = {

  addMarker: function addMarker(currAirport) {
    var marker = new google.maps.Marker({
      position: {lat: currAirport.Latitude, lng: currAirport.Longitude},
      map: globalMap,
      title: currAirport.Code
    });
    //adds click listener on markers to change #airport-list info
    marker.addListener('click', function() {
      $('#airport-list').val(marker.title);
      $('#airport-list').change();
    })
    //creating array of markers.
    markers.push(marker);

    globalMap.setCenter({lat: currAirport.Latitude, lng: currAirport.Longitude})
  },

  addToMarkerList: function() {
    //creates marker and adds marker el to list
    var marker = markers[markers.length -1];
    var title = marker.title;
    var $markerDiv = $('<div></div>')
    $markerDiv.attr('id', title);
    $markerDiv.appendTo('#markerList');
    var $markerItem = $('<p></p>');
    $markerItem.text(title);
    $markerItem.appendTo('#' + title);
    var $markerBtn = $('<button></button>');
    $markerBtn.text('X');
    $markerBtn.appendTo('#' + title);
  },

  remFromMarkerList: function() {
    //removes marker from list and marker array
    var id = $(this).parent().attr('id');
    var toRemove = _.findIndex(markers, {title: id});
    if (toRemove > -1) {
      markers[toRemove].setMap(null);
      markers.splice(toRemove, 1);
    }
    var currAirport = _.findWhere(sites, {Code: id});
    currAirport.toggled = 0;
    $(this).parent().remove();
  },

  goToMarker: function() {
    //changes map view when marker is selected from marker list
    var id =$(this).attr('id');
    var toCenter = _.findIndex(markers, {title: id});
    if(toCenter > -1) {
      var marker = markers[toCenter];
      globalMap.setCenter(marker.position);
      $('#airport-list').val(marker.title);
      $('#airport-list').change();
    }
  }
}
