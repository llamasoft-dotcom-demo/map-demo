export const mapState = (state = {displayHint: true}, action) => {
    switch (action.type) {
        case 'TOGGLE_HINT':
            return {
                ...state,
                displayHint: action.displayHint
            };
        case 'REFRESH_MAP':
            return {
                ...state,
                refreshKey: action.refreshKey
            };
        default:
            return state;
    }
};
