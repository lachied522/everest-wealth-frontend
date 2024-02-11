import type { PortfolioData, PopulatedHolding, AdviceData } from "@/types/types";

export type Action = {
    type: 'SET_DATA'
    payload: PortfolioData[]
} | {
    type: 'UPDATE_HOLDINGS'
    payload: {
        id: string // portfolio id
        data: PopulatedHolding[]
    }
} | {
    type: 'TOGGLE_LOCKED'
    payload: {
        id: string // id of holding to be toggled
    }
} | {
    type: 'SET_ADVICE'
    payload: {
        id: string
        data: Partial<AdviceData>
    }
} | {
    type: 'RESET_ADVICE'
    payload: {
        id: string // portfolio id
    }
} | {
    type: 'SET_SETTINGS'
    payload: {
        id: string // portfolio id
        data: any // TODO
    }
} | {
    type: 'DELETE_PORTFOLIO'
    payload: {
        id: string
    }
}

export function GlobalReducer(state: PortfolioData[], action: Action): PortfolioData[] {
    switch(action.type) {

        case 'SET_DATA': {
            return action.payload;
        }

        case 'UPDATE_HOLDINGS': {
            return state.map(p => {
                if (p.id === action.payload.id) {
                    // remove zero-unit holdings
                    const filteredData = action.payload.data.filter((obj) => obj.units !== 0) || [];
                    // calculate new total portfolio value
                    const totalValue = filteredData.reduce((acc, obj) => acc + obj.value, 0);
                    return {
                        ...p,
                        holdings: filteredData,
                        totalValue,
                    }
                }
                return p;
            });
        }

        case 'TOGGLE_LOCKED': {
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

        case 'SET_ADVICE': {
            return state.map(p => {
                if (p.id === action.payload.id) {
                    return {
                        ...p,
                        advice: [{
                            ...p.advice[0],
                            ...action.payload.data
                        }],
                    }
                }
                return p;
            })
        }

        case 'RESET_ADVICE': {
            return state.map(p => {
                if (p.id === action.payload.id) {
                    return {
                        ...p,
                        advice: [],
                    }
                }
                return p;
            })
        }

        case 'SET_SETTINGS': {
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

