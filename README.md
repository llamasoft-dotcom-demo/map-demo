![](http://jpsierens.com/wp-content/uploads/2016/06/react-eco-wp.gif)

# Implemented by - HAMED P -

![](https://preview.ibb.co/jUCG1k/Screen_Shot_2017_08_19_at_7_16_24_PM.png)

# Message Demo Excercise
This project is created using a react, redux, and react-router with the help of webpack. (copyright: Hamed P)

Contains:

* a working example of a google map and user interactions with it.
* It utilizes the ```react-google-maps``` library.
* ```jQuery``` was removed, and ```lodash``` is used instead of ```underscore```.
* ES6/7 Support with Babel.
* bootstrap styling and components for quick implementation of appealing visuals.
* Redux dev tools to keep track of the app's state.
* routing and deep linking.
* hot module replacement (HMR) support so you can change modules or react components without having to reload the browser
* a webpack production config so you can build the app and make it ready for production
* sass and css module support that prevents style-bleeding due to hashing
* autoprefixer package to automatically add the vendor prefixes and remove the unnecessary CSS styles
* eslint to keep the code more readable.
* ```shrinkwrap``` is used to lock package versions to avoid potential package discrepancies in future.
* ```immutable``` library was not used. I write pure functions and follow functional paradigm myself and don’t need a library to do the job for me.
* much more...


## What about the google map?

After trying several different react google map libraries only to realize they don't work properly, I finally used the ```react-google-maps``` package to display and wrap the google map, and then implemented most of the functionalities myself. Marker, layouts, and user interactions are all implemented by myself. That took me sometime, but I enjoyed it a lot.
This project is created using a react, redux, and react-router with the help of webpack:

#### Please Note:
* Map defaults to Detroit.
* When the airport is selected the marker is shown on the map, and a marker hint is displayed. If you click on the marker the hint will disapear. If you click the marker one more time it will display the hint again.
* There is a 'Remove Marker' button that when clicked diselects the chosen airport, and removes the data from Redux store.
* Keep the 'Collapsible Data Panel' open to see data changing live as different airports are selected. This demonstrates another way of presenting data.
* The 'Refresh Map' button will center the map at the marker point. It is disabled if no airport is selected. I achieved this by incrementing a number in redux store and assigning it to the google map ```key``` attribute forcing it to re-render.


## Run the app in 'dev' mode:

0. ```npm install```
0. ```npm run dev```

## See the project:

``` http://localhost:9000/  ```


## The redux Dev-Tools settings:
Use the following key combinations after the page is loaded to hide/reposition the Redux dev tools.

```Toggle Visibility Key : CTRL + H```

```Change Position Key : CTRL + W```

## How does the simulator engine work?

Because components render automatically as soon as there is a change to the state/props, the process of sending messages at random time was hard to achieve using normal react lifecycle hooks without sending the app into an infinite/dead loop. I figured this can be done by utilizing the new async/await feature of ES7 to make delays between each rendering. The async/await would work asyncrounsly with promises, but it's more readable as the code reads like a syncronous code. In a real life scenario a more mature setup is required or the data will be provided to the notification component differently.

## Build the app for production
```npm run build```

This will build the app into the "dist" directory in the root of the project. It contains the index.html along with the minified assets, ready for production.

![](http://i.imgur.com/uUg2A3S.png)

It should look something like the above image.
