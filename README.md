# map-demo
A sample project for prospects

This is Joe Gregoria's submission for this project.

+ Added grunt stuff so I could make sure I didn't screw up any simple javascript stuff.
+ Fill in data. 
+ Fix the "name" vs "full site name" bug, where two divs have the same identifier. To make it work for now, just changed from setting-name to setting-fullname in the setting-value area.
+ used underscore's sort and foreach loop to sort sites in the dropdown.
+ based heavily on https://developers.google.com/maps/documentation/javascript/examples/marker-remove, allows the user to hide, show, or delete all markers.
+ Using some useful googled code, when the user selects an airport, we will recenter on it (at the current zoom level). Also added feature so that if the users clicks "show all markers", we will reset the map's size so that we can see all of the markers; kinda cool!  Thanks, Internet!
+ clean up the extra prefix strings from the full names.  fix the loop for showing all markers on the map.
+ only extend the map bounds if there are markers to show. Move around the hide-show-delete box so I can see it all at once with the dropdown. set a starting position of A**2. one more foreach refactor.
+ created this readme file.

Extra questions not directly addressed in the code changes:

"We are constantly struggling with displaying as much data as simply and streamlined as possible. Is there something you can do with the layout to show the same information using less screen real estate?"

For starters, we can delete the instructions on the page! probably a toggle would be good. Users probably don't care about Lat and Long coordinates, so we can take that out. We could likely display more info in the roll-over pop-up with the code, city, state, and full name.  Or, if user testing said so, we could put all of the markers' in a list on the side bar. Before investing too heavily in this area, I'd want to do some usability testing and get some feedback.

"Regarding markers, what happens with the existing code when you select an item multiple times?"

In my code, they end up in the list multiple times. I left that alone for now, because I really don't know the eventual use case (e.g., some sort of routing system?). If we only wanted them in there once, we could use a dictionary-type object (don't add if already in there). We'll leave that for version 2.