
function  initMap() {
  // Callback function to create a map object and specify the DOM element for display.
  globalMap = new google.maps.Map(document.getElementById('airport-map'), {
    center: {lat: 42.2814, lng: -83.7483},
    scrollwheel: true,
    zoom: 5
  });
  
  // set map to angular controller
  var scope = angular.element(document.getElementById("main")).scope()
  scope.controller.initGoogleMap(globalMap);
  
}