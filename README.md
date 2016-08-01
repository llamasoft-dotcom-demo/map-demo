# map-demo
A sample project for prospects

To fill in the table data when a user selects an airport code, I targeted each id and assigned it text with the current airport information using dot notation. Ex. Map.js line 31. I had to change the id on line 99 because it was used twice, this way the table would fill in properly

To allow users to remove markers I allowed a user to click on the last marker added it then cleared the table data and popped the last marker that was pushed to the array when it was created.

I sorted the airport code names alphabetically in the loadSiteList function by using ._sortBy and passing the airport code in.

To make the site responsive I used bootstrap and set the width of the map to 100% so it would resize with the screen.

When a user selects an airport code I centered the map by assigning a new google map and centering it based off of current selected latitude and longitude.

I also used a media query and a text overflow in CSS to control the table data.
