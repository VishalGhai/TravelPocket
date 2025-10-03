import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TravelProvider } from '../context/TravelContext';
import BudgetPage from '../components/BudgetPage';
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
    selectedActivities: ['1', '2'], // Select first two activities
    budgetBreakdown: demoItinerary.budgetBreakdown,
    ...initialState
  };

  return render(
    <BrowserRouter>
      <TravelProvider>
        <BudgetPage />
      </TravelProvider>
    </BrowserRouter>
  );
};

describe('BudgetPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders budget page with trip summary', () => {
    renderWithProviders();
    
    expect(screen.getByText('Budget Planning')).toBeInTheDocument();
    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('romantic')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('displays budget breakdown by category', () => {
    renderWithProviders();
    
    expect(screen.getByText('Budget Breakdown')).toBeInTheDocument();
    expect(screen.getByText('Selected Activities')).toBeInTheDocument();
    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getByText('Travel')).toBeInTheDocument();
    expect(screen.getByText('Accommodation')).toBeInTheDocument();
  });

  test('shows selected activities details', () => {
    renderWithProviders();
    
    expect(screen.getByText('Selected Activities')).toBeInTheDocument();
    expect(screen.getByText('City Walking Tour')).toBeInTheDocument();
    expect(screen.getByText('Local Food Experience')).toBeInTheDocument();
  });

  test('displays budget distribution chart', () => {
    renderWithProviders();
    
    expect(screen.getByText('Budget Distribution')).toBeInTheDocument();
    expect(screen.getByText('Activities')).toBeInTheDocument();
    expect(screen.getByText('Food')).toBeInTheDocument();
  });

  test('shows trip summary information', () => {
    renderWithProviders();
    
    expect(screen.getByText('Trip Summary')).toBeInTheDocument();
    expect(screen.getByText('Destination:')).toBeInTheDocument();
    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Trip Type:')).toBeInTheDocument();
    expect(screen.getByText('romantic')).toBeInTheDocument();
    expect(screen.getByText('Travelers:')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('enables edit mode when edit button is clicked', () => {
    renderWithProviders();
    
    const editButton = screen.getByText('Edit Budget');
    fireEvent.click(editButton);
    
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
  });

  test('allows editing budget values in edit mode', () => {
    renderWithProviders();
    
    const editButton = screen.getByText('Edit Budget');
    fireEvent.click(editButton);
    
    const foodInput = screen.getByDisplayValue('200');
    fireEvent.change(foodInput, { target: { value: '300' } });
    
    expect(foodInput.value).toBe('300');
  });

  test('saves budget changes when save button is clicked', () => {
    renderWithProviders();
    
    const editButton = screen.getByText('Edit Budget');
    fireEvent.click(editButton);
    
    const foodInput = screen.getByDisplayValue('200');
    fireEvent.change(foodInput, { target: { value: '300' } });
    
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);
    
    expect(screen.getByText('Edit Budget')).toBeInTheDocument();
  });

  test('cancels edit mode when cancel button is clicked', () => {
    renderWithProviders();
    
    const editButton = screen.getByText('Edit Budget');
    fireEvent.click(editButton);
    
    const foodInput = screen.getByDisplayValue('200');
    fireEvent.change(foodInput, { target: { value: '300' } });
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(screen.getByText('Edit Budget')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument(); // Original value restored
  });

  test('calculates total budget correctly', () => {
    renderWithProviders();
    
    // Selected activities: City Walking Tour (25) + Local Food Experience (40) = 65 per person
    // For 2 people: 65 * 2 = 130
    // Other costs: 200 + 300 + 150 + 400 + 50 = 1100
    // Total: 130 + 1100 = 1230
    expect(screen.getByText('1230 USD')).toBeInTheDocument();
  });

  test('shows per person cost correctly', () => {
    renderWithProviders();
    
    // Total: 1230, Per person: 1230 / 2 = 615
    expect(screen.getByText('615 USD')).toBeInTheDocument();
  });

  test('displays activity costs correctly', () => {
    renderWithProviders();
    
    // City Walking Tour: 25 * 2 = 50
    expect(screen.getByText('50 USD')).toBeInTheDocument();
    // Local Food Experience: 40 * 2 = 80
    expect(screen.getByText('80 USD')).toBeInTheDocument();
  });

  test('navigates back to itinerary page when back button is clicked', () => {
    renderWithProviders();
    
    const backButton = screen.getByText('Back to Activities');
    fireEvent.click(backButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/itinerary');
  });

  test('redirects to itinerary page when no activities are selected', () => {
    renderWithProviders({ selectedActivities: [] });
    
    expect(screen.getByText('No Activities Selected')).toBeInTheDocument();
    expect(screen.getByText('Please go back and select some activities first.')).toBeInTheDocument();
  });

  test('shows download and share buttons', () => {
    renderWithProviders();
    
    expect(screen.getByText('Download Itinerary')).toBeInTheDocument();
    expect(screen.getByText('Share Trip')).toBeInTheDocument();
  });

  test('displays duration information', () => {
    renderWithProviders();
    
    expect(screen.getByText('Duration:')).toBeInTheDocument();
    expect(screen.getByText('2 days')).toBeInTheDocument();
  });

  test('shows number of selected activities', () => {
    renderWithProviders();
    
    expect(screen.getByText('Activities:')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('handles budget input validation', () => {
    renderWithProviders();
    
    const editButton = screen.getByText('Edit Budget');
    fireEvent.click(editButton);
    
    const foodInput = screen.getByDisplayValue('200');
    fireEvent.change(foodInput, { target: { value: '-100' } });
    
    // Should not allow negative values
    expect(foodInput.value).toBe('0');
  });
});
