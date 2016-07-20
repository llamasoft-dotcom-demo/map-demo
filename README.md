# Map-Demo presented by Sarthak Joshi

# UI Changes
1. Completely redesigned UI to make it responsive and modern
2. Added vertical navigation using side bar method [Please check references]
3. Added "Instructions" control to view original instructions

# Functional Changes
1. As per requirement changes are made to layout such that google map which is focus of application takes most real estate
2. A collapsible side bar is enabled which gives more comprehensive map view on collapse
3. On drop down selection marker is placed at selected airport and map is panned to that location also city is added to sidebar
4. On marker click event full site name is showed as info window
5. When city is clicked on sidebar full airport details are shown in modal window
5. Implemented delete marker function => **'Right click'** any marker to remove it from map [As expected this also removes city element from sidebar]
6. When an already existing airport is selected map just pans to that airport rather than re adding new marker

# Future Enhancement
1. User should have [mostly in admin role] control over airport data. So that **CRUD** methods can be easily performed on airport data
2. System can be made data driven since airport list can grow out of hand very quickly

# Technologies Used
1. Bootstrap
2. JQuery
3. Underscore.js
4. Google Maps API

# References
1. Idea and template for side bar [http://www.jqueryscript.net/demo/Bootstrap-Sidebar-Extension-With-jQuery-CSS-CSS3/] 2. Simple Sidebar Template [http://startbootstrap.com/template-overviews/simple-sidebar/] **Code released under the MIT license. Docs 
