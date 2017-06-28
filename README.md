# map-demo

# Updates made
* Complete overhaul of aiport selection control. A list of airport codes now appear on the left side of the map. Each has their own toggle button for turning the marker on/off. This list can be filtered as you type.
* Got rid of the information panel that shows the currently selected airport data. Instead this is now accessible when you click on the marker. This reduces the amount of screen real estate for showing the same data.
* When you toggle an airport the map will pan to the location so it is easy to find.
* The list of airports is sorted
* Zoomed out initial scale so you can see more airports at once.
* General layout improvements using Bootstrap CSS and other plugins.

# Code observations
I went back and forth on a couple of designs for selecting an airport. I liked the toggle idea because it kept the entire aiport management control all in one place. You can easily toggle on/off airports quickly. It also didn't really make sense to be able to select the same airport back-to-back. This was actually pretty easy to implement. Instead of having to maintain an array of markers I just used a map of them and show/hide them as needed.

I did make another architechtural change and that involved the google map api callback. Before my changes, the application could get into a state where the user could be interacting with the airport selector before the google map api was even ready. To address this I placed loadSiteList() function the initMap() callback function so that the list would not load until the map was ready to be interacted with.

# Potential Improvements
* Use some more user friendly text within the list. Maybe even multiple filter citeria. Lots of possibilities here for the filtering.
* In order to interact with the application you really need to wait for google maps to load. A nice UI feature would be to add some masking, or loading bar, to give some feedback to the user that something is happening.
* Code organization could be better

# Above and Beyond
* I think the filtering and toggling feature is great solution to this activity. It provides very quick access to pinpointing airports while also taking advantage of screen limited screen real estate. It is fun to rapidly toggle through airports.
