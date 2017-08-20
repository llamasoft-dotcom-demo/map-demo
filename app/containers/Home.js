import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Accordion, Panel, Button } from 'react-bootstrap';
import Map from '../components/Map';
import MapDesc from '../components/MapDesc';
import { refreshAndCenterMap } from '../actions/mapActions';
import { simulateAsyncFetchAirportData, simulateAsyncFetchAllSiteCodes } from '../actions';


import styles from '../styles/styles.scss';


class Home extends React.Component {
    static propTypes = {
        airport: PropTypes.shape({
            code: PropTypes.string,
            city: PropTypes.string,
            state: PropTypes.string,
            name: PropTypes.string,
            lat: PropTypes.number,
            long: PropTypes.number,
            sortedSites: PropTypes.array
        }),
        sortedSites: PropTypes.shape({
            code: PropTypes.string,
            city: PropTypes.string,
            state: PropTypes.string
        }),
        actions: PropTypes.shape({
            fetchAllSiteCodes: PropTypes.func,
            onDropdownChange: PropTypes.func,
            refreshMap: PropTypes.func,
        })
    };

    componentDidMount() {
        this.props.actions.fetchAllSiteCodes();
    }

    handleChange(e) {
        const code = !!e.target.value ? [e.target.value] : [];
        this.props.actions.onDropdownChange(code[0]);
    }

    handleButtonClick() {
        this.props.actions.refreshMap();
    }

    render() {
        return (
            <div className={styles.homeContentWrapper}>


            <MapDesc />


            <div className={styles.mapWrapper}>
                <Map />
            </div>

            <form className={styles.formStyles}>
                <select
                    className={styles.dropDown}
                    value={this.props.airport.code || ''}
                    onChange={e => this.handleChange(e)}
                >
                    <option value="">
                        Select an ariport...
                    </option>
                    {
                        this.props.airport && this.props.airport.sortedSites && this.props.airport.sortedSites.map(site => (
                            <option key={site.Code} value={site.Code}>
                                {`${site.Code} - (${site.City}, ${site.State})`}
                            </option>
                        ))
                    }
                </select>

                <Button
                    className={styles.refreshButton}
                    disabled={!(!!this.props.airport.code)}
                    onClick={()=>this.handleButtonClick()}
                >
                    <div>Refresh Map</div>
                </Button>

            </form>

            <div className={styles.acordionWrapper}>
                <Accordion>
                    <Panel header="Collapsible Data Panel" eventKey="1">
                        Here we can display extra data and information to the end user. It is collapsible so that it doesn't take much space on the screen, and also indicates that this data is optional and not as important.

                        <div className={styles.blockStyle}>Notice how selecting and removing an airport affects this section:</div>

                        { this.props.airport.code &&
                            <div>
                                <div>CODE: {this.props.airport.code}</div>
                                <div>CITY: {this.props.airport.city}</div>
                                <div>STATE: {this.props.airport.state}</div>
                                <div>NAME: {this.props.airport.name.replace('AIRPORT_' + this.props.airport.code + '_', '')}</div>
                                <div>COORDS.: ({this.props.airport.lat}, {this.props.airport.long})</div>
                            </div>
                        }
                    </Panel>
                    <Panel header="Collapsible Instruction Panel" eventKey="2">
                        <ul>
                            <li>We are constantly struggling with displaying as much data as simply and
                                streamlined as possible. Is there something you can do with the layout to show
                                the same information using less screen real estate?</li>

                            <li>Regarding markers, what happens with the existing code when you select an item multiple times?</li>

                            <li>If a user selects an airport that is not currently shown on the map, how do they find it?
                                Can you make this easier?</li>
                        </ul>
                    </Panel>
                </Accordion>
            </div>


        </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        airport: state.airport
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: {
            refreshMap: () => dispatch(refreshAndCenterMap()),
            onDropdownChange: code => dispatch(simulateAsyncFetchAirportData(code)),
            fetchAllSiteCodes: () => dispatch(simulateAsyncFetchAllSiteCodes())
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
