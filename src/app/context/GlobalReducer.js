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
                        data: action.payload.data,
                    }
                }
                return p;
            });
        }

        case 'UPDATE_NAME': {
            return state.map(p => {
                if (p.id === action.payload.id) {
                    return {
                        ...p,
                        name: action.payload.name,
                    }
                }
                return p;
            });
        }

        // case 'ADD_HOLDING': {
        //     return [
        //         action.payload, 
        //         ...state
        //     ];
        // };

        // case 'DELETE_HOLDING': {
        //     return state.filter(holding => holding.symbol !== action.payload.symbol);
        // };

        default:
            return state;
    }
}

