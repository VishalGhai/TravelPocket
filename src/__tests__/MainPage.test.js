import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TravelProvider } from '../context/TravelContext';
import MainPage from '../components/MainPage';

// Mock the navigate function
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock the Gemini API
jest.mock('../services/geminiApi', () => ({
  generateItinerary: jest.fn(),
}));

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <TravelProvider>
        {component}
      </TravelProvider>
    </BrowserRouter>
  );
};

describe('MainPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders main page with all form elements', () => {
    renderWithProviders(<MainPage />);
    
    expect(screen.getByText('TravelPocket')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Where do you want to go?')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Select trip motive')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter budget')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('How many people?')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('How many days?')).toBeInTheDocument();
    expect(screen.getByText('Generate My Itinerary')).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    renderWithProviders(<MainPage />);
    
    const searchButton = screen.getByText('Generate My Itinerary');
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByText('Please enter a destination')).toBeInTheDocument();
      expect(screen.getByText('Please select a trip motive')).toBeInTheDocument();
      expect(screen.getByText('Please enter a valid number of days')).toBeInTheDocument();
      expect(screen.getByText('Please enter a valid number of members')).toBeInTheDocument();
      expect(screen.getByText('Please enter a valid budget')).toBeInTheDocument();
    });
  });

  test('updates form inputs correctly', () => {
    renderWithProviders(<MainPage />);
    
    const placeInput = screen.getByPlaceholderText('Where do you want to go?');
    const budgetInput = screen.getByPlaceholderText('Enter budget');
    const membersInput = screen.getByPlaceholderText('How many people?');
    const daysInput = screen.getByPlaceholderText('How many days?');
    
    fireEvent.change(placeInput, { target: { value: 'Paris' } });
    fireEvent.change(budgetInput, { target: { value: '1000' } });
    fireEvent.change(membersInput, { target: { value: '2' } });
    fireEvent.change(daysInput, { target: { value: '3' } });
    
    expect(placeInput.value).toBe('Paris');
    expect(budgetInput.value).toBe('1000');
    expect(membersInput.value).toBe('2');
    expect(daysInput.value).toBe('3');
  });

  test('handles form submission with valid data', async () => {
    const mockItinerary = {
      itinerary: { days: [] },
      activities: [],
      budgetBreakdown: { food: 200, travel: 300, activities: 150, accommodation: 400, other: 50 }
    };
    
    const { generateItinerary } = require('../services/geminiApi');
    generateItinerary.mockResolvedValue(mockItinerary);
    
    renderWithProviders(<MainPage />);
    
    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Where do you want to go?'), { target: { value: 'Paris' } });
    fireEvent.change(screen.getByDisplayValue('Select trip motive'), { target: { value: 'romantic' } });
    fireEvent.change(screen.getByPlaceholderText('How many days?'), { target: { value: '3' } });
    fireEvent.change(screen.getByPlaceholderText('How many people?'), { target: { value: '2' } });
    fireEvent.change(screen.getByPlaceholderText('Enter budget'), { target: { value: '1000' } });
    
    // Submit form
    fireEvent.click(screen.getByText('Generate My Itinerary'));
    
    await waitFor(() => {
      expect(generateItinerary).toHaveBeenCalledWith({
        place: 'Paris',
        motive: 'romantic',
        budget: '1000',
        currency: 'USD',
        includeTravelCost: true,
        numberOfMembers: 2,
        numberOfDays: 3
      });
    });
  });

  test('displays loading state during API call', async () => {
    const { generateItinerary } = require('../services/geminiApi');
    generateItinerary.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));
    
    renderWithProviders(<MainPage />);
    
    // Fill and submit form
    fireEvent.change(screen.getByPlaceholderText('Where do you want to go?'), { target: { value: 'Paris' } });
    fireEvent.change(screen.getByDisplayValue('Select trip motive'), { target: { value: 'romantic' } });
    fireEvent.change(screen.getByPlaceholderText('How many days?'), { target: { value: '3' } });
    fireEvent.change(screen.getByPlaceholderText('How many people?'), { target: { value: '2' } });
    fireEvent.change(screen.getByPlaceholderText('Enter budget'), { target: { value: '1000' } });
    
    fireEvent.click(screen.getByText('Generate My Itinerary'));
    
    expect(screen.getByText('Generating Itinerary...')).toBeInTheDocument();
    expect(screen.getByText('Generate My Itinerary')).toBeDisabled();
  });

  test('handles API errors gracefully', async () => {
    const { generateItinerary } = require('../services/geminiApi');
    generateItinerary.mockRejectedValue(new Error('API Error'));
    
    renderWithProviders(<MainPage />);
    
    // Fill and submit form
    fireEvent.change(screen.getByPlaceholderText('Where do you want to go?'), { target: { value: 'Paris' } });
    fireEvent.change(screen.getByDisplayValue('Select trip motive'), { target: { value: 'romantic' } });
    fireEvent.change(screen.getByPlaceholderText('How many days?'), { target: { value: '3' } });
    fireEvent.change(screen.getByPlaceholderText('How many people?'), { target: { value: '2' } });
    fireEvent.change(screen.getByPlaceholderText('Enter budget'), { target: { value: '1000' } });
    
    fireEvent.click(screen.getByText('Generate My Itinerary'));
    
    await waitFor(() => {
      expect(screen.getByText('Failed to generate itinerary. Please try again.')).toBeInTheDocument();
    });
  });
});
