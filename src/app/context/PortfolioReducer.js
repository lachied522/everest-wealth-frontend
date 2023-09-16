export default function PortfolioReducer(state, action) {
    switch(action.type) {
        case 'SET_DATA': {
            return action.payload;
        }
        case 'ADD_HOLDING': {
            return [
                action.payload, 
                ...state
            ];
        };
        case 'DELETE_HOLDING': {
            return state.filter(holding => holding.symbol !== action.payload.symbol);
        };
        default:
            return state;
    }
}

