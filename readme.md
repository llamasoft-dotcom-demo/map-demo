# map-demo

This application implements a mapping system for Llamasoft. 

## Required features
* Generally made the app more useful.
* Filled in the rest of the data into a user table when a user selects an airport.
* Allowed a user to remove a marker.
* Sorted the list so it is easier to find airports.

## Extra features
* Made the UI much more responsive and generally more useable
* Optimized the code so that repeated new markers were not created. The existing marker were re-used.
* Automatically moved the map to center on the new marker.
* The layout was updated to make the page more readable, etc. 
* CSS was added to make the page responsive and works on smaller devices.
* A developer pipeline was added to allow for easy installation of development dependencies and testing of the application.
 * Please see package.json file
 * This is a small project so grunt wasn't needed. Used NPM as a task runner.
* A favicon was added as well as various styling choices to make the UI easier to use.
* Map.html was rewritten extensively. 
 * Language localization
 * Meta tags added
 * CSS classes completely changed in favor of bootstrap
 * Scripts moved to bottom to allow for faster loading of the main HTML
 * Generally removed extra tags that weren't being used
* Msg.css rewritten extensively.
 * Old css removed.
 * Sidebar added
 * Main screen added
 * Generally more responsive to display changes
* map.js was rewritten extensively.
 * Moved and refactored google api code into it's own file.
 * Classes were added and OO design principles were used.
 * Instead of a drop down a more user friendly list box was used to allow the user to both turn on and turn off multiple markers.
 * Events were added to the check boxes to add and remove a marker
* A new file GoogleMapApi.js was added to contain the google api code
 * This file was optimized for performance to allow multiple markers to exist
 * Work was done to avoid unnecessary calls to google's api
 * Modifications to the prototype of InfoWindow were made to track its open state.
 * Work was done to project new scale on the info windows if the user zooms up or down on the map.
 * Airport data was loaded into the info windows and can be seen when the user selects a marker.
* siteData.js was modified.
 * The data was cleaned up, with some errors being fixed.
 * A sorting method was written using underscore.
* A readme.md (this file) was edited.

## Installing the app

Run the command below to install the required files to run this application. 

```
npm install
```

## Running the app

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

```
npm start
```

### Prerequisites

This application requires NodeJS and NPM to be installed. 
The package manager will also only work in a windows environment.

Install NodeJS from: [NodeJS.org](https://nodejs.org/en)

Ensure you have the latest version of NPM by the following command:
```
npm install npm -g
```

## Authors

* **Mark Jazayeri** - *Initial work* - [Mark-Jazayeri](https://github.com/Mark-Jazayeri)

## License

This project is licensed under the ISC License

## Acknowledgments

* Llamasoft

