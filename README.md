# Updates I made and extra features:
1. The dropdown menu is sorted by City name to make it easier to find a particular airport.
2. I also included a search feature in the dropdown to make finding an airport even easier if the user needs to search by state or code.
3. To maximize the utility of space, I created 'info boxes' on the map to display the airport information. 
4. The info boxes allow the user to delete the marker if they wish.
5. When selecting airports they are also added to a list so the user can see everything they have selected.
6. I included a reset button to remove all markers and clear the selected airports list.
7. styled the map for design purposes and changed the default 'marker' icons to indicate that the user is indeed searching airports
8. I added a media query to make the site responsive when used on a mobile app.  The menu is moved to the top and the selected airports list is removed.

#Interesting things you noticed about the code:
I noticed the map functions are namespaced to avoid collisions with other objects or variables in the global scope. 
This guided my decision to make any other functions a property of that object.

#Suggestions for improvements:
1. Add features to the selected airports list to allow user to pan to that airport on click or remove the airport from the sidebar
2. Further refactor code into modules to allow for unit testing.
3. Add geolocation to allow users to search nearby airports.
4. Add a feature to allow users to search all airports in a particular state.


