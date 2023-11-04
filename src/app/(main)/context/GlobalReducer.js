export default function GlobalReducer(state, action) {
    switch(action.type) {

        case 'SET_DATA': {
            return action.payload;
        }

        case 'UPDATE_DATA': {
            return state.map(p => {
                if (p.id === action.payload.id) {
                    return {
                        ...p,
                        holdings: action.payload.data,
                        totalValue: action.payload.totalValue,
                    }
                }
                return p;
            });
        }

        case 'TOGGLE_FAVOURITE': {
            return state.map(p => {
                return {
                    ...p,
                    holdings: p.holdings.map(holding => {
                        if (holding.id === action.payload.id) {
                            return {
                                ...holding,
                                locked: !holding.locked,
                            }
                        }
                        return holding;
                    })
                }
            });
        }

        case 'NEW_ADVICE': {
            return state.map(p => {
                if (p.id === action.payload.id) {
                    return {
                        ...p,
                        advice: [action.payload.data],
                    }
                }
                return p;
            })
        }

        case 'TOGGLE_ACTIONED': {
            return state.map(p => {
                if (p.id === action.payload.id) {
                    return {
                        ...p,
                        advice: [{
                            ...p.advice[0],
                            actioned: true,
                        }],
                    }
                }
                return p;
            })
        }

        case 'UPDATE_SETTINGS': {
            return state.map(p => {
                if (p.id === action.payload.id) {
                    return {
                        ...p,
                        ...action.payload.data,
                    }
                }
                return p;
            });
        }

        case 'DELETE_PORTFOLIO': {
            return state.filter(p => p.id!==action.payload.id);
        }

        default:
            return state;
    }
}

