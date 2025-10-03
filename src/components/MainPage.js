import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTravel } from '../context/TravelContext';
import { generateItinerary, testGeminiAPI } from '../services/geminiApi';
import { Search, MapPin, Users, DollarSign, Plane, Calendar } from 'lucide-react';

const MainPage = () => {
  const { state, dispatch } = useTravel();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const motives = [
    { value: 'romantic', label: 'Romantic' },
    { value: 'educative', label: 'Educative' },
    { value: 'nature', label: 'Nature' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'relaxation', label: 'Relaxation' }
  ];

  const currencies = [
    { value: 'INR', label: 'INR (₹)' },
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'JPY', label: 'JPY (¥)' },
    { value: 'CAD', label: 'CAD (C$)' },
    { value: 'AUD', label: 'AUD (A$)' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!state.place.trim()) {
      newErrors.place = 'Please enter a destination';
    }
    if (!state.source.trim()) {
      newErrors.source = 'Please enter your starting location';
    }
    if (!state.motive) {
      newErrors.motive = 'Please select a trip motive';
    }
    if (!state.numberOfDays || state.numberOfDays < 1) {
      newErrors.numberOfDays = 'Please enter a valid number of days';
    }
    if (!state.numberOfMembers || state.numberOfMembers < 1) {
      newErrors.numberOfMembers = 'Please enter a valid number of members';
    }
    if (!state.budget || state.budget <= 0) {
      newErrors.budget = 'Please enter a valid budget';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTestAPI = async () => {
    console.log('Testing Gemini API...');
    try {
      const result = await testGeminiAPI();
      console.log('Test result:', result);
      alert('API test completed. Check console for details.');
    } catch (error) {
      console.error('API test failed:', error);
      alert('API test failed. Check console for details.');
    }
  };

  const handleSearch = async () => {
    if (!validateForm()) {
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const travelData = {
        place: state.place,
        source: state.source,
        motive: state.motive,
        budget: state.budget,
        currency: state.currency,
        includeTravelCost: state.includeTravelCost,
        numberOfMembers: state.numberOfMembers,
        numberOfDays: state.numberOfDays
      };

      const result = await generateItinerary(travelData);
      
      console.log('API Result:', result);
      console.log('Activities from API:', result.activities);
      console.log('Activities length:', result.activities ? result.activities.length : 'No activities');
      
      dispatch({ type: 'SET_ITINERARY', payload: result.itinerary });
      dispatch({ type: 'SET_ACTIVITIES', payload: result.activities });
      dispatch({ type: 'SET_BUDGET_BREAKDOWN', payload: result.budgetBreakdown });
      
      navigate('/itinerary');
    } catch (error) {
      console.error('Error generating itinerary:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to generate itinerary. Please try again.' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Travel<span className="text-primary-600">Pocket</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI-powered travel planning that creates personalized itineraries based on your preferences and budget
          </p>
        </div>

        {/* Main Form */}
        <div className="max-w-4xl mx-auto">
          <div className="card">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Plan Your Perfect Trip
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Destination */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <MapPin className="inline w-4 h-4 mr-2" />
                  Destination
                </label>
                <input
                  type="text"
                  placeholder="Where do you want to go?"
                  value={state.place}
                  onChange={(e) => dispatch({ type: 'SET_PLACE', payload: e.target.value })}
                  className={`input-field ${errors.place ? 'border-red-500' : ''}`}
                />
                {errors.place && <p className="text-red-500 text-sm">{errors.place}</p>}
              </div>

              {/* Source */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <MapPin className="inline w-4 h-4 mr-2" />
                  Starting Location
                </label>
                <input
                  type="text"
                  placeholder="Where are you traveling from?"
                  value={state.source}
                  onChange={(e) => dispatch({ type: 'SET_SOURCE', payload: e.target.value })}
                  className={`input-field ${errors.source ? 'border-red-500' : ''}`}
                />
                {errors.source && <p className="text-red-500 text-sm">{errors.source}</p>}
              </div>

              {/* Trip Motive */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Trip Motive
                </label>
                <select
                  value={state.motive}
                  onChange={(e) => dispatch({ type: 'SET_MOTIVE', payload: e.target.value })}
                  className={`input-field ${errors.motive ? 'border-red-500' : ''}`}
                >
                  <option value="">Select trip motive</option>
                  {motives.map((motive) => (
                    <option key={motive.value} value={motive.value}>
                      {motive.label}
                    </option>
                  ))}
                </select>
                {errors.motive && <p className="text-red-500 text-sm">{errors.motive}</p>}
              </div>

              {/* Number of Days */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <Calendar className="inline w-4 h-4 mr-2" />
                  Number of Days
                </label>
                <input
                  type="number"
                  placeholder="How many days?"
                  value={state.numberOfDays}
                  onChange={(e) => dispatch({ type: 'SET_NUMBER_OF_DAYS', payload: parseInt(e.target.value) || 1 })}
                  className={`input-field ${errors.numberOfDays ? 'border-red-500' : ''}`}
                  min="1"
                  max="30"
                />
                {errors.numberOfDays && <p className="text-red-500 text-sm">{errors.numberOfDays}</p>}
              </div>

              {/* Number of Members */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <Users className="inline w-4 h-4 mr-2" />
                  Number of Members
                </label>
                <input
                  type="number"
                  placeholder="How many people?"
                  value={state.numberOfMembers}
                  onChange={(e) => dispatch({ type: 'SET_NUMBER_OF_MEMBERS', payload: parseInt(e.target.value) || 1 })}
                  className={`input-field ${errors.numberOfMembers ? 'border-red-500' : ''}`}
                  min="1"
                  max="20"
                />
                {errors.numberOfMembers && <p className="text-red-500 text-sm">{errors.numberOfMembers}</p>}
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <DollarSign className="inline w-4 h-4 mr-2" />
                  Budget
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Enter budget"
                    value={state.budget}
                    onChange={(e) => dispatch({ type: 'SET_BUDGET', payload: e.target.value })}
                    className={`input-field flex-1 ${errors.budget ? 'border-red-500' : ''}`}
                    min="1"
                  />
                  <select
                    value={state.currency}
                    onChange={(e) => dispatch({ type: 'SET_CURRENCY', payload: e.target.value })}
                    className="input-field w-32"
                  >
                    {currencies.map((currency) => (
                      <option key={currency.value} value={currency.value}>
                        {currency.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.budget && <p className="text-red-500 text-sm">{errors.budget}</p>}
              </div>
            </div>

            {/* Include Travel Cost Toggle */}
            <div className="mt-6">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={state.includeTravelCost}
                  onChange={(e) => dispatch({ type: 'SET_INCLUDE_TRAVEL_COST', payload: e.target.checked })}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  <Plane className="inline w-4 h-4 mr-2" />
                  Include travel costs (flights, transportation) in budget
                </span>
              </label>
            </div>

            {/* Error Message */}
            {state.error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{state.error}</p>
              </div>
            )}

            {/* Search Button */}
            <div className="mt-8 text-center">
              <button
                onClick={handleSearch}
                disabled={state.loading}
                className="btn-primary text-lg px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
              >
                {state.loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Generating Itinerary...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Generate My Itinerary
                  </>
                )}
              </button>
              
              {/* Test API Button - Temporary for debugging */}
              <button
                onClick={handleTestAPI}
                className="btn-secondary text-sm px-4 py-2 mt-2 mx-auto block"
              >
                Test API
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Planning</h3>
            <p className="text-gray-600">AI-powered itinerary generation based on your preferences and budget</p>
          </div>
          <div className="text-center">
            <div className="bg-secondary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-secondary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Budget Control</h3>
            <p className="text-gray-600">Track and manage your travel expenses with detailed budget breakdowns</p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalized</h3>
            <p className="text-gray-600">Customized recommendations for different trip types and group sizes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
