import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/styles.scss';
import Routes from '../routes';
import { Panel } from 'react-bootstrap';


const App = () => (
    <div className={styles.mainWrapper}>

        <div className={styles.headerWrapper}>
            <div className={styles.titleText}>LLamasoft Map Exercise</div>
            <div className={styles.slogan}>Supply Chain By Design</div>
        </div>

        <div className={styles.contentWrapper}>
            <div className={styles.devTools}>
                <Panel header={'Dev Tools Settings'} bsStyle="success">
                    <div>Toggle Visibility Key = ctrl + h</div>
                    <div>Change Position Key = ctrl + w</div>
                </Panel>
            </div>


                {
                    // here we render the inner pages and routes.
                    Routes
                }


        </div>

        <div className={styles.footer}>
            <div className={styles.footerLinks}>
                <Link to="/">Home Page</Link> | <Link to="/about">About Page</Link> | <Link to="/excercise">Excercise Page</Link>
            </div>
            <span className={styles.copyRight}>&copy; LLamasoft 2017</span>
        </div>
    </div>
);

export default App;
