# map-demo
I completed the following
* Fill in the rest of the data in the table when a user selects an airport.
* Allow a user to remove a marker
  * I did this by adding a link to the page and allowing the using to remove or ad the marker. I could have done something just with the marker it self like right click but figured I would play with this and and it added some complexity of how to do it.
* Sort the list so it is easier to find airports

# Extras
We are constantly struggling with displaying as much data as simply and streamlined as possible. Is there something you can do with the layout to show the same information using less screen real estate?
* I just added an info window for the the marker and placed the information there and allowed the user to close the info window if they wanted to.

Regarding markers, what happens with the existing code when you select an item multiple times?
* Not really sure as I think I coded around this early, but it was probably making multiple instances of the markers. I added the markers to an array and removed them if they were deleted. Well I just deleted them everytime we added a new one because I didn't see a reason to keep multiple on the screen. I could change that though pretty easily.

If a user selects an airport that is not currently shown on the map, how do they find it? Can you make this easier?
* Just made it zoom to the added marker.
