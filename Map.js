var globalMap;
var markers = [];
//functions declared in Jquery document.ready
$(function() {

  MapFcns.loadSiteList();
  //when #airport-list is changed, triggers siteListChange
  $('#airport-list').change(MapFcns.siteListChange);
  //
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
  //check for click on marker delete buttons
  $('#markerList').on('click', 'button', MarkerFcns.remFromMarkerList);
  //check for click on marker divs, to select marker
  $('#markerList').on('click', 'div', MarkerFcns.goToMarker);

});




function  initMap() {
  // Callback function to create a map object and specify the DOM element for display.
  globalMap = new google.maps.Map(document.getElementById('airport-map'), {
    center: {lat: 42.2814, lng: -83.7483},
    scrollwheel: true,
    zoom: 6
  });

    }
