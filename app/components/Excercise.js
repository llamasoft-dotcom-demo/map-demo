import React from 'react';
import { Well } from 'react-bootstrap';

const Excercise = () => (
    <div>
        <div id="exercise-description">
            <div id="instruction-toggle"><span>Instructions</span> <span id="exercise-toggle">-</span></div>

            <div>
                In helping clients understand their supply chains, maps are an important visualization tool.
                In this exercise we would like you to take some steps to help make this map more useful.
                This example uses Google Maps and their maps API to show information about airports. While
                we do not use Google Maps and the maps API, the types of visualizations and map interactions
                you are allowed with Google Maps are common. In order to do this exercise you will need to get
                an API key for Google Maps if you do not already have one. Put the API key in the appropriate place
                in this file.
            </div>

            <div>
                Currently this page loads a list of airports into a drop down. You can select an airport
                and it&quot;s code and city will display in the data table. A marker will be placed on the
                map displaying the airport. If you roll your mouse over the marker the airport&quot;s code
                will be displayed.
            </div>

            <div>
                The current code is very simple. Many improvements need to be made:
                <ul>
                  <li>Fill in the rest of the data in the table when a user selects an airport.</li>
                  <li>Allow a user to remove a marker</li>
                  <li>Sort the list so it is easier to find airports</li>
                </ul>
            </div>

            <div>
                Some more things to think about
                <ul>
                      <li>We are constantly struggling with displaying as much data as simply and
                      streamlined as possible. Is there something you can do with the layout to show
                      the same information using less screen real estate?</li>

                      <li>Regarding markers, what happens with the existing code when you select an item multiple times?</li>

                      <li>If a user selects an airport that is not currently shown on the map, how do they find it?
                  Can you make this easier?</li>
                </ul>
            </div>
        </div>

        <div>
            <Well bsSize="large">
                <strong>NOTE:</strong> jQuery is removed, and Lodash is used instead of underscore!
            </Well>
        </div>
    </div>
);

export default Excercise;
