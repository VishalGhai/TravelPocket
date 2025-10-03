import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTravel } from '../context/TravelContext';
import ActivityCard from './ActivityCard';
import { ArrowLeft, Calendar, Clock, MapPin, ArrowRight, CheckCircle } from 'lucide-react';

const ItineraryPage = () => {
  const { state, dispatch } = useTravel();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state.itinerary || !state.activities) {
      navigate('/');
    }
  }, [state.itinerary, state.activities, navigate]);

  const handleActivityToggle = (activityId) => {
    dispatch({ type: 'TOGGLE_ACTIVITY', payload: activityId });
  };

  const calculateTotalCost = () => {
    return state.selectedActivities.reduce((total, activityId) => {
      const activity = state.activities.find(a => a.id === activityId);
      return total + (activity ? activity.costPerPerson * state.numberOfMembers : 0);
    }, 0);
  };

  const getSelectedActivitiesCount = () => {
    return state.selectedActivities.length;
  };

  const getActivityCardsCount = () => {
    console.log('All activities:', state.activities);
    console.log('Activities with category "activities":', state.activities.filter(activity => activity.category === 'activities'));
    
    // If no activities have category 'activities', show all activities
    const activitiesWithCategory = state.activities.filter(activity => activity.category === 'activities');
    if (activitiesWithCategory.length === 0) {
      console.log('No activities with category "activities", showing all activities');
      return state.activities.length;
    }
    
    return activitiesWithCategory.length;
  };

  const handleProceedToBudget = () => {
    if (state.selectedActivities.length === 0) {
      alert('Please select at least one activity to proceed to budget planning.');
      return;
    }
    navigate('/budget');
  };

  if (!state.itinerary || !state.activities) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Itinerary Found</h2>
          <p className="text-gray-600 mb-6">Please go back and generate an itinerary first.</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Planning
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Planning
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Your {state.place} Itinerary
          </h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        {/* Trip Summary */}
        <div className="card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{state.source}</div>
              <div className="text-sm text-gray-600">From</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{state.place}</div>
              <div className="text-sm text-gray-600">To</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{state.motive}</div>
              <div className="text-sm text-gray-600">Trip Type</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{state.numberOfDays}</div>
              <div className="text-sm text-gray-600">Days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{state.numberOfMembers}</div>
              <div className="text-sm text-gray-600">Travelers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {state.budget} {state.currency}
              </div>
              <div className="text-sm text-gray-600">Budget</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Itinerary Timeline */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-2" />
              Daily Itinerary
            </h2>
            <div className="space-y-6">
              {state.itinerary.days.map((day, index) => (
                <div key={day.day} className="card">
                  <div className="flex items-center mb-4">
                    <div className="bg-primary-100 text-primary-600 w-8 h-8 rounded-full flex items-center justify-center font-semibold mr-3">
                      {day.day}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Day {day.day}</h3>
                      <p className="text-sm text-gray-600">{day.date}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {day.activities.map((activity, activityIndex) => (
                      <div key={activityIndex} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <Clock className="w-4 h-4 text-gray-500 mt-1" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{activity.time}</span>
                            <span className="text-gray-600">-</span>
                            <span className="font-medium text-gray-900">{activity.activity}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {activity.place}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activities Selection */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                <CheckCircle className="w-6 h-6 mr-2" />
                Select Activities
              </h2>
              <div className="text-sm text-gray-600">
                {getSelectedActivitiesCount()} of {getActivityCardsCount()} selected
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {(() => {
                const activitiesWithCategory = state.activities.filter(activity => activity.category === 'activities');
                const activitiesToShow = activitiesWithCategory.length > 0 ? activitiesWithCategory : state.activities;
                
                console.log('Activities to show:', activitiesToShow);
                
                return activitiesToShow.map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    isSelected={state.selectedActivities.includes(activity.id)}
                    onToggle={handleActivityToggle}
                    currency={state.currency}
                  />
                ));
              })()}
            </div>

            {/* Selection Summary */}
            <div className="card mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Selection Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Selected Activities:</span>
                  <span className="font-medium">{getSelectedActivitiesCount()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Cost:</span>
                  <span className="font-semibold text-lg">
                    {calculateTotalCost()} {state.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Per Person:</span>
                  <span className="font-medium">
                    {state.numberOfMembers > 0 ? Math.round(calculateTotalCost() / state.numberOfMembers) : 0} {state.currency}
                  </span>
                </div>
              </div>
            </div>

            {/* Proceed Button */}
            <button
              onClick={handleProceedToBudget}
              disabled={state.selectedActivities.length === 0}
              className="w-full btn-primary text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              Proceed to Budget Planning
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryPage;
