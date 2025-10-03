import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { TravelProvider, useTravel } from '../context/TravelContext';

const wrapper = ({ children }) => <TravelProvider>{children}</TravelProvider>;

describe('TravelContext', () => {
  test('provides initial state', () => {
    const { result } = renderHook(() => useTravel(), { wrapper });
    
    expect(result.current.state).toEqual({
      place: '',
      motive: '',
      budget: '',
      currency: 'USD',
      includeTravelCost: true,
      numberOfMembers: 1,
      itinerary: null,
      activities: [],
      selectedActivities: [],
      budgetBreakdown: {
        food: 0,
        travel: 0,
        activities: 0,
        accommodation: 0,
        other: 0
      },
      loading: false,
      error: null
    });
  });

  test('updates place correctly', () => {
    const { result } = renderHook(() => useTravel(), { wrapper });
    
    act(() => {
      result.current.dispatch({ type: 'SET_PLACE', payload: 'Paris' });
    });
    
    expect(result.current.state.place).toBe('Paris');
  });

  test('updates motive correctly', () => {
    const { result } = renderHook(() => useTravel(), { wrapper });
    
    act(() => {
      result.current.dispatch({ type: 'SET_MOTIVE', payload: 'romantic' });
    });
    
    expect(result.current.state.motive).toBe('romantic');
  });

  test('updates budget correctly', () => {
    const { result } = renderHook(() => useTravel(), { wrapper });
    
    act(() => {
      result.current.dispatch({ type: 'SET_BUDGET', payload: '1000' });
    });
    
    expect(result.current.state.budget).toBe('1000');
  });

  test('updates currency correctly', () => {
    const { result } = renderHook(() => useTravel(), { wrapper });
    
    act(() => {
      result.current.dispatch({ type: 'SET_CURRENCY', payload: 'EUR' });
    });
    
    expect(result.current.state.currency).toBe('EUR');
  });

  test('toggles includeTravelCost correctly', () => {
    const { result } = renderHook(() => useTravel(), { wrapper });
    
    act(() => {
      result.current.dispatch({ type: 'SET_INCLUDE_TRAVEL_COST', payload: false });
    });
    
    expect(result.current.state.includeTravelCost).toBe(false);
  });

  test('updates numberOfMembers correctly', () => {
    const { result } = renderHook(() => useTravel(), { wrapper });
    
    act(() => {
      result.current.dispatch({ type: 'SET_NUMBER_OF_MEMBERS', payload: 3 });
    });
    
    expect(result.current.state.numberOfMembers).toBe(3);
  });

  test('sets itinerary correctly', () => {
    const { result } = renderHook(() => useTravel(), { wrapper });
    const mockItinerary = { days: [{ day: 1, activities: [] }] };
    
    act(() => {
      result.current.dispatch({ type: 'SET_ITINERARY', payload: mockItinerary });
    });
    
    expect(result.current.state.itinerary).toEqual(mockItinerary);
  });

  test('sets activities correctly', () => {
    const { result } = renderHook(() => useTravel(), { wrapper });
    const mockActivities = [
      { id: '1', name: 'Activity 1', costPerPerson: 25 },
      { id: '2', name: 'Activity 2', costPerPerson: 50 }
    ];
    
    act(() => {
      result.current.dispatch({ type: 'SET_ACTIVITIES', payload: mockActivities });
    });
    
    expect(result.current.state.activities).toEqual(mockActivities);
  });

  test('toggles activity selection correctly', () => {
    const { result } = renderHook(() => useTravel(), { wrapper });
    
    // Add first activity
    act(() => {
      result.current.dispatch({ type: 'TOGGLE_ACTIVITY', payload: '1' });
    });
    
    expect(result.current.state.selectedActivities).toEqual(['1']);
    
    // Add second activity
    act(() => {
      result.current.dispatch({ type: 'TOGGLE_ACTIVITY', payload: '2' });
    });
    
    expect(result.current.state.selectedActivities).toEqual(['1', '2']);
    
    // Remove first activity
    act(() => {
      result.current.dispatch({ type: 'TOGGLE_ACTIVITY', payload: '1' });
    });
    
    expect(result.current.state.selectedActivities).toEqual(['2']);
  });

  test('sets budget breakdown correctly', () => {
    const { result } = renderHook(() => useTravel(), { wrapper });
    const mockBreakdown = {
      food: 200,
      travel: 300,
      activities: 150,
      accommodation: 400,
      other: 50
    };
    
    act(() => {
      result.current.dispatch({ type: 'SET_BUDGET_BREAKDOWN', payload: mockBreakdown });
    });
    
    expect(result.current.state.budgetBreakdown).toEqual(mockBreakdown);
  });

  test('sets loading state correctly', () => {
    const { result } = renderHook(() => useTravel(), { wrapper });
    
    act(() => {
      result.current.dispatch({ type: 'SET_LOADING', payload: true });
    });
    
    expect(result.current.state.loading).toBe(true);
  });

  test('sets error state correctly', () => {
    const { result } = renderHook(() => useTravel(), { wrapper });
    
    act(() => {
      result.current.dispatch({ type: 'SET_ERROR', payload: 'Test error' });
    });
    
    expect(result.current.state.error).toBe('Test error');
  });

  test('resets state correctly', () => {
    const { result } = renderHook(() => useTravel(), { wrapper });
    
    // Set some state
    act(() => {
      result.current.dispatch({ type: 'SET_PLACE', payload: 'Paris' });
      result.current.dispatch({ type: 'SET_MOTIVE', payload: 'romantic' });
      result.current.dispatch({ type: 'SET_BUDGET', payload: '1000' });
    });
    
    // Reset
    act(() => {
      result.current.dispatch({ type: 'RESET' });
    });
    
    expect(result.current.state.place).toBe('');
    expect(result.current.state.motive).toBe('');
    expect(result.current.state.budget).toBe('');
  });

  test('throws error when used outside provider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();
    
    expect(() => {
      renderHook(() => useTravel());
    }).toThrow('useTravel must be used within a TravelProvider');
    
    console.error = originalError;
  });
});
