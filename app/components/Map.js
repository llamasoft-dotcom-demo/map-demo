/* eslint--disable */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import GoogleMap from 'google-map-react';
import { toggleMarkerTextDisplay } from '../actions/mapActions';
import { removeAirport } from '../actions';
import Marker from './Marker';


// import styles from '../styles/styles.scss';


class Map extends Component {
    static propTypes = {
        defaultZoom: PropTypes.number,
        defaultCenter: PropTypes.shape({
            lat: PropTypes.number,
            lng: PropTypes.number
        }),
        map: PropTypes.shape({
            displayHint: PropTypes.bool,
            refreshKey: PropTypes.number
        }),
        airport: PropTypes.shape({
            code: PropTypes.string,
            city: PropTypes.string,
            state: PropTypes.string,
            name: PropTypes.string,
            lat: PropTypes.number,
            long: PropTypes.number
        }),
        actions: PropTypes.shape({
            onMarkerClick: PropTypes.func,
            removeMarkerAndAirport: PropTypes.func,
        })
    };

    static defaultProps = {
        defaultCenter: {lat: 42.2161722, lng: -83.3553842}, // Detroit
        defaultZoom: 10
    };

    onMarkerClick = () => {
        const displayHint = this.props.map.displayHint;
        this.props.actions.onMarkerClick(displayHint);
    }

    onRemoveButtonClick = () => {
        this.props.actions.removeMarkerAndAirport();
    };


    render() {
        const {
            airport,
            defaultCenter,
            defaultZoom,
            map,
        } = this.props;

        const mapCenter = {
            lat: airport.lat || defaultCenter.lat,
            lng: airport.long || defaultCenter.lng
        };

        return (
            <GoogleMap
                key={this.props.map.refreshKey}
                zoom={defaultZoom}
                center={mapCenter}
                margin={[30, 30, 30, 30]}
                bootstrapURLKeys={{key: 'AIzaSyBVCdvmMU2j8F--eIFifuuMgOsQRUkX6Qk'}}
            >
            {
                airport && airport.code &&
                <Marker
                    lat={airport.lat || defaultCenter.lat}
                    lng={airport.long || defaultCenter.lng}
                    data={airport}
                    displayHint={map.displayHint}
                    onMarkerClick={this.onMarkerClick}
                    onRemoveButtonClick={this.onRemoveButtonClick}
                />
            }
            </GoogleMap>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        airport: state.airport,
        map: state.map
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: {
            onMarkerClick: (displayHint) => dispatch(toggleMarkerTextDisplay(displayHint)),
            removeMarkerAndAirport: () => dispatch(removeAirport())
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Map);
