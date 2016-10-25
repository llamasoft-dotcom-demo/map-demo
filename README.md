
The basic requirements of this application were...

- Fill in the rest of the data in the table when a user selects an airport.
- Allow a user to remove a marker
- Sort the list so it is easier to find airports

I fulfilled these requirements and made many improvements.

- Improved UI/UX by modifying the layout, controls and color scheme of the application.
- Saved "screen real estate" by implementing a Google Maps API InfoWindow in the map. This shows detailed information about each airport on the map itself.
- Improved data presentation, use-ability and UX by using an HTML table to display all active markers (instead of just 1).
- Improved data presentation, use-ability and UX by automatically panning to newly created markers.
- Improved data presentation, use-ability and UX by allowing the user to click on any active marker record in the data table to navigate to the marker.
- Improved data presentation, use-ability and UX by allowing the user to simply right click on an active marker to close it (which removes it from the table as well)
- Improved memory usage/performance by implementing a simple cache (used a dictionary) for the Google Map API marker objects. Only one marker can be created at a location at a given time instead of wrecklessly creating them over and over.

I completed this using Bootstrap, JavaScript, HTML and CSS. I wanted to keep this simple.

If I did this again I would do this with AngularJS. In my opinion, Angular helps maintain better OO design. I also like having the template-ing features that Angular offers. I would also consider setting up the application to work with
Node's NPM, Bower and Grunt to streamline the development process. In the end I decided I did not want to spend my time doing all that on such a small application.

This was a lot of fun. It's been real, Llamasoft.

