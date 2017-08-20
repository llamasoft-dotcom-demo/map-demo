import React from 'react';
import styles from '../styles/styles.scss';


const MapDesc = () => (
    <div className={styles.mapDescription}>
        <h3>Please Note:</h3>
        <ul>
            <li>Map defaults to Detroit.</li>

            <li>When the airport is selected the marker is shown on the map, and a marker hint is displayed. If you click on the marker the hint will disapear. If you click the marker one more time it will display the hint again.</li>

            <li>There is a 'Remove Marker' button that when clicked diselects the chosen airport, and removes the data from Redux store. </li>

            <li>Keep the 'Collapsible Data Panel' open to see data changing live as different airports are selected. This demonstrates another way of presenting data.</li>

            <li>The 'Refresh Map' button will center the map at the marker point. It is disabled if no airport is selected. I achieved this by incrementing a number in redux store and assigning it to the google map ```key``` attribute forcing it to re-render.</li>
        </ul>
    </div>
);


export default MapDesc;
