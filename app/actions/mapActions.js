let refreshKey = 0;

export const toggleMarkerTextDisplay = displayHint => ({
    type: 'TOGGLE_HINT',
    displayHint: displayHint ? false : true
});


export const refreshAndCenterMap = () => ({
    type: 'REFRESH_MAP',
    refreshKey: refreshKey++
});
