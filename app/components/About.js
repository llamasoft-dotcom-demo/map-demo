import React from 'react';
import { Panel } from 'react-bootstrap';
import styles from '../styles/styles.scss';


const About = () => {
    const notes = [
        '* a working example of a google map and user interactions with it.',
        '* It utilizes the react-google-maps library.',
        '* ES6/7 Support with Babel.',
        '* jQuery was removed, and lodash is used instead of underscore.',
        '* bootstrap styling and components for quick implementation of appealing visuals.',
        '* Redux dev tools to keep track of the app\'s state.',
        '* routing and deep linking.',
        '* hot module replacement (HMR) support so you can change modules or react components without having to reload the browser',
        '* a webpack production config so you can build the app and make it ready for production',
        '* sass and css module support that prevents style-bleeding due to hashing',
        '* autoprefixer package to automatically add the vendor prefixes and remove the unnecessary CSS styles',
        '* eslint to keep the code more readable',
        '* shrinkwrap is used to lock package versions to avoid potential package discrepancies in future.',
        '* immutable library was not used. I write pure functions and follow functional paradigm myself and don’t need a library to do the job for me.',
        '* much more...'
    ];

    return (
        <div>
            <Panel header="About This Project">
                <h3>Applicant: Hamed Peikari</h3>
                <div className={styles.blockStyle}>
                    Notice the route is working properly in the navbar. That is because react-router is used.
                    Thanks for your interest in my application. I look forward to being part of your team and beringing my skills to your company.

                </div><div className={styles.blockStyle}>
                    <h4 className={styles.blockStyle}>
                        What about the google map?
                    </h4>
                    After trying several different react google map libraries only to realize they don't work properly, I finally used the react-google-maps package to display and wrap the google map, and then implemented most of the functionalities myself. Marker, layouts, and user interactions are all implemented by myself. That took me sometime, but I enjoyed it a lot.
                </div>

                <div className={styles.blockStyle}>
                    <h4 className={styles.blockStyle}>
                        This project is created using a react, redux, and react-router with the help of webpack:
                    </h4>
                    {
                        notes.map( (note, indx) =>
                            <div key={indx}> { note } </div>
                        )
                    }
                </div>
            </Panel>
        </div>
    );
};

export default About;
