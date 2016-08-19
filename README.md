# map-demo by Alexander Heerens

## Thoughts and Ideas

* Because there is not a lot of UI changes (fades etc) but many information to display and change I selected AngularJS for a clear separation of the view and the business logic. Also the binding of data between the view and the model can be archived in a simple way compared to jQuery.

* The layout is a bootstrap theme with a simple layout. I like the map to use as much screen estate a possible and decided to make it fullscreen. The original airport information had way to much whitespace. So I moved that into a small header.

* Moved most of the JS files to the bottom for better performance. Angular is still loaded in the head because it must be present when my controller is created.

* Because the init method for the map is called in an async manner, the map is set to the controller at a later point of time.

* Using a controller it was very easy to hold the current state of the web application. I  added a list that holds all added airports and I can work on that list when markers are added or deleted. Also the currently selected airport/marker is stored in the controller.
