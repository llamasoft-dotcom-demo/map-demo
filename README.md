# map-demo
## Submission by bejumi

### Overall Plan
My goal was to maintain some of the default styling of the site but move all the functionality to the map itself.
The only additional external library I included was Bootstrap to make the page look a bit more consistent as well as free airport pin icon from [flaticon](http://www.flaticon.com) that is credited on the page. 

### Improvements
- Existing data table was moved from below the map to an InfoWindow shown when the user clicks the airport icon
- Only a single marker is used that is moved across the map as the user selects an airports
- The airport selection list is sorted by city
- To reduce screen real estate, all the information and controls were moved to the map itself and styled to look like native map controls
- A single global marker is used as this solution assumes a single airport is displayed
- The map uses panTo when a new airport is selected to allow the user to understand the relationship between airports
- The default marker icon was replaced with a more appropriate pin
- Use geolocation to initially center the map if the user allows it

### Assumptions
- Users only want to see a single airport at a time so I used a global marker and infoWindow
  - If multiple airports are to be viewed simultaneously a collection of each must be maintained
  - This collection could be lazy loaded as the user selects airports or loaded asynchronously after page load
- The user is more familiar with city names rather than airport codes
  - If codes are better, the text of each option and the compare method can easily be changed or the option to pick either could be added
- The built in maps panTo does not smoothly transition across large distances when zoomed
  - Some custom pan logic could be added if this was requested by users
  - Example [here](http://stackoverflow.com/questions/3817812/google-maps-v3-can-i-ensure-smooth-panning-every-time)
- An attempt was made to minimize existing code formatting changes to make the diff clearer
  - This would not be necessary in an environment with code standards or code cleaning tools

### Next Steps
The exercise was very light on user context so I had to make some assumptions about what the user was doing. 
In a real project, the actual use case (as a user story or requirement) would drive those decisions. 
I would also consider making a fancier custom control to allow grouping, sorting and searching of airports.
It would also be good to have some additional data on the airports in the InfoWindow (perhaps images pulled from google's places api).   
