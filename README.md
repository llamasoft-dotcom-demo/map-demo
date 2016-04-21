# Map Exercise

### Added features
1) The layout has been completely updating using a Bootstrap dashboard layout. The instructions have been moved to a dropdown from the nav bar, the list of possible and selected airports is on the left side, and the map takes up a majority of the screen on the right.

2) The airport select list has been replaced by a searchable dropdown, using the third-party library [Select2](https://select2.github.io/).

3) When an airport is selected from the dropdown, instead of filling in a static box with the relevant information, a panel is added to the list below the dropdown with the new airport's information. This panel is inserted in alphabetical order among the other aiports already in the list, and scrolled to if need-be. It is also highlighted in the same way as if it had been clicked on. 

4) Also when an airport is selected, the marker is place on the map, and the map moves to center on the new marker. If that marker is later clicked on, it will highlight the relevant panel in the list and scroll to it.

5) If an existing panel is clicked on, it will highlight and move the map to center on the relevant marker, which bounces for a couple of seconds to draw attention.

6) An X button was placed on each new panel.  When clicked it removes the panel and its associated marker.

7) Refactored the javascript into a more readable format, and organized some of the functions to group together similar functionality.

### Known issues
1) Originally, the map also zoomed in whenever it centered on a new marker.  However, for whatever reason (and it looks like this is related to a known issue), the map would center on Boise when selected, but the marker wouldn't drop until the map was moved manually.

2) Bootstrap's responsive resizing can be a double-edged sword. The map disappears when it switches to its sub-768 pixel format.

### Things to think about
1) There are many different ways to show this same data. One is to have an info box which appears when clicking on a marker. This can simplify display but requires extra actions to see all the data. There are plenty of other options available. Making UX decisions in a void can lead to designs that make sense for the developer but not for others further removed.

2) Should I have had the airports removed from the dropdown list once they're selected? I thought about it, but couldn't really decide, so I just left it. Nothing happens if you select an airport that has already been selected. Now that I write that, it probably would make more sense to at least have the relevant airport highlight and center on the map. Next time...

3) This may not work that well on a tablet. Although it could, I just didn't have a chance to try it out.

4) This would look TERRIBLE on a phone.
