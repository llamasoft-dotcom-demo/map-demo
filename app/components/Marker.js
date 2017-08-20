import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';


import styles from '../styles/styles.scss';

const planeLogo = 'http://images.clipartpanda.com/airplane-with-banner-png-Airplane-icon.png';
const markerLogo = 'https://cdn2.iconfinder.com/data/icons/color-svg-vector-icons-2/512/map_marker_base-256.png';

const Marker = ({
    data,
    displayHint,
    onMarkerClick,
    onRemoveButtonClick
}) => {
    return (
        <div className={styles.markerWrapper}>
            <div
                className={[
                    styles.markerText,
                    displayHint ? '' : styles.invisible
                ].join(' ')}
            >
                <div>
                    <Button
                        bsStyle="danger"
                        bsSize="xsmall"
                        onClick={onRemoveButtonClick}
                        >
                        Remove Marker
                    </Button>
                </div>
                <div>
                    <img className={styles.markerPlaneLogo} src={planeLogo}></img>
                    {data.code} : {data.city}, {data.state}
                </div>
                <div>({data.lat}, {data.long})</div>
                <div>{data.name && data.name.replace('AIRPORT_' + data.code + '_', '')}</div>
            </div>
            <div onClick={onMarkerClick}>
                <img className={styles.markerLogo} src={markerLogo}></img>
            </div>
        </div>
    );
};

Marker.propTypes = {
    data: PropTypes.shape({
        code: PropTypes.string,
        city: PropTypes.string,
        state: PropTypes.string,
        name: PropTypes.string,
        lat: PropTypes.number,
        long: PropTypes.number
    }),
    displayHint: PropTypes.bool,
    onMarkerClick: PropTypes.func,
    onRemoveButtonClick: PropTypes.func
};

const mapStateToProps = (state) => {
    return {
        map: state.map
    };
};


export default connect(mapStateToProps, null)(Marker);
