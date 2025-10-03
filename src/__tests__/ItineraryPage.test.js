import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TravelProvider } from '../context/TravelContext';
import ItineraryPage from '../components/ItineraryPage';
import { demoItinerary } from '../data/demoData';

// Mock the navigate function
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderWithProviders = (component, initialState = {}) => {
  const defaultState = {
    place: 'Paris',
    motive: 'romantic',
    budget: '1000',
    currency: 'USD',
    includeTravelCost: true,
    numberOfMembers: 2,
    itinerary: demoItinerary.itinerary,
    activities: demoItinerary.activities,
    selectedActivities: [],
    ...initialState
  };

  return render(
    <BrowserRouter>
      <TravelProvider>
        <ItineraryPage />
      </TravelProvider>
    </BrowserRouter>
  );
};

describe('ItineraryPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders itinerary page with trip summary', () => {
    renderWithProviders();
    
    expect(screen.getByText('Your Paris Itinerary')).toBeInTheDocument();
    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('romantic')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1000 USD')).toBeInTheDocument();
  });

  test('displays daily itinerary with activities', () => {
    renderWithProviders();
    
    expect(screen.getByText('Daily Itinerary')).toBeInTheDocument();
    expect(screen.getByText('Day 1')).toBeInTheDocument();
    expect(screen.getByText('Day 2')).toBeInTheDocument();
    expect(screen.getByText('City Walking Tour')).toBeInTheDocument();
    expect(screen.getByText('Local Food Experience')).toBeInTheDocument();
  });

  test('displays activity selection section', () => {
    renderWithProviders();
    
    expect(screen.getByText('Select Activities')).toBeInTheDocument();
    expect(screen.getByText('0 of 10 selected')).toBeInTheDocument();
    expect(screen.getByText('Proceed to Budget Planning')).toBeInTheDocument();
  });

  test('shows activity cards with correct information', () => {
    renderWithProviders();
    
    expect(screen.getByText('City Walking Tour')).toBeInTheDocument();
    expect(screen.getByText('Historic Center')).toBeInTheDocument();
    expect(screen.getByText('Explore the historic landmarks and cultural sites with a knowledgeable guide')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('per person')).toBeInTheDocument();
  });

  test('handles activity selection', () => {
    renderWithProviders();
    
    const toggleButtons = screen.getAllByTitle('Add to budget');
    expect(toggleButtons).toHaveLength(10);
    
    fireEvent.click(toggleButtons[0]);
    
    expect(screen.getByText('1 of 10 selected')).toBeInTheDocument();
    expect(screen.getByText('Added to budget')).toBeInTheDocument();
  });

  test('updates selection summary when activities are selected', () => {
    renderWithProviders();
    
    const toggleButtons = screen.getAllByTitle('Add to budget');
    fireEvent.click(toggleButtons[0]); // Select first activity (25 per person)
    fireEvent.click(toggleButtons[1]); // Select second activity (40 per person)
    
    expect(screen.getByText('2 of 10 selected')).toBeInTheDocument();
    expect(screen.getByText('130 USD')).toBeInTheDocument(); // (25 + 40) * 2 people
    expect(screen.getByText('65 USD')).toBeInTheDocument(); // 130 / 2 people
  });

  test('proceeds to budget page when activities are selected', () => {
    renderWithProviders();
    
    const toggleButtons = screen.getAllByTitle('Add to budget');
    fireEvent.click(toggleButtons[0]);
    
    const proceedButton = screen.getByText('Proceed to Budget Planning');
    fireEvent.click(proceedButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/budget');
  });

  test('shows alert when trying to proceed without selecting activities', () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    renderWithProviders();
    
    const proceedButton = screen.getByText('Proceed to Budget Planning');
    fireEvent.click(proceedButton);
    
    expect(alertSpy).toHaveBeenCalledWith('Please select at least one activity to proceed to budget planning.');
    
    alertSpy.mockRestore();
  });

  test('navigates back to main page when back button is clicked', () => {
    renderWithProviders();
    
    const backButton = screen.getByText('Back to Planning');
    fireEvent.click(backButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('redirects to main page when no itinerary is available', () => {
    renderWithProviders({ itinerary: null, activities: null });
    
    expect(screen.getByText('No Itinerary Found')).toBeInTheDocument();
    expect(screen.getByText('Please go back and generate an itinerary first.')).toBeInTheDocument();
  });

  test('displays activity categories and badges correctly', () => {
    renderWithProviders();
    
    expect(screen.getByText('Activities')).toBeInTheDocument();
    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getByText('Travel')).toBeInTheDocument();
    expect(screen.getByText('Accommodation')).toBeInTheDocument();
  });

  test('shows activity duration and best time', () => {
    renderWithProviders();
    
    expect(screen.getByText('3 hours')).toBeInTheDocument();
    expect(screen.getByText('morning')).toBeInTheDocument();
    expect(screen.getByText('afternoon')).toBeInTheDocument();
  });
});
