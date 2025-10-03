import React, { createContext, useContext, useReducer } from 'react';

const TravelContext = createContext();

const initialState = {
  // User inputs
  place: '',
  source: '',
  motive: '',
  budget: '',
  currency: 'USD',
  includeTravelCost: true,
  numberOfMembers: 1,
  numberOfDays: 1,
  
  // Generated data
  itinerary: null,
  activities: [],
  selectedActivities: [],
  
  // Budget data
  budgetBreakdown: {
    food: { total: 0, items: [] },
    travel: { total: 0, items: [] },
    activities: { total: 0, items: [] },
    accommodation: { total: 0, items: [] },
    other: { total: 0, items: [] }
  },
  
  // UI state
  loading: false,
  error: null
};

const travelReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PLACE':
      return { ...state, place: action.payload };
    case 'SET_SOURCE':
      return { ...state, source: action.payload };
    case 'SET_MOTIVE':
      return { ...state, motive: action.payload };
    case 'SET_BUDGET':
      return { ...state, budget: action.payload };
    case 'SET_CURRENCY':
      return { ...state, currency: action.payload };
    case 'SET_INCLUDE_TRAVEL_COST':
      return { ...state, includeTravelCost: action.payload };
    case 'SET_NUMBER_OF_MEMBERS':
      return { ...state, numberOfMembers: action.payload };
    case 'SET_NUMBER_OF_DAYS':
      return { ...state, numberOfDays: action.payload };
    case 'SET_ITINERARY':
      return { ...state, itinerary: action.payload };
    case 'SET_ACTIVITIES':
      return { ...state, activities: action.payload };
    case 'TOGGLE_ACTIVITY':
      const activityId = action.payload;
      const isSelected = state.selectedActivities.includes(activityId);
      return {
        ...state,
        selectedActivities: isSelected
          ? state.selectedActivities.filter(id => id !== activityId)
          : [...state.selectedActivities, activityId]
      };
    case 'SET_BUDGET_BREAKDOWN':
      return { ...state, budgetBreakdown: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

export const TravelProvider = ({ children }) => {
  const [state, dispatch] = useReducer(travelReducer, initialState);

  const value = {
    state,
    dispatch
  };

  return (
    <TravelContext.Provider value={value}>
      {children}
    </TravelContext.Provider>
  );
};

export const useTravel = () => {
  const context = useContext(TravelContext);
  if (!context) {
    throw new Error('useTravel must be used within a TravelProvider');
  }
  return context;
};
