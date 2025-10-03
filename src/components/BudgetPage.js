import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTravel } from '../context/TravelContext';
import { ArrowLeft, Edit3, DollarSign, PieChart, Download, Share2 } from 'lucide-react';

const BudgetPage = () => {
  const { state, dispatch } = useTravel();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editableBudget, setEditableBudget] = useState(state.budgetBreakdown);

  useEffect(() => {
    if (!state.itinerary || !state.activities || state.selectedActivities.length === 0) {
      navigate('/itinerary');
    }
  }, [state.itinerary, state.activities, state.selectedActivities, navigate]);

  const calculateSelectedActivitiesCost = () => {
    return state.selectedActivities.reduce((total, activityId) => {
      const activity = state.activities.find(a => a.id === activityId);
      return total + (activity ? activity.costPerPerson * state.numberOfMembers : 0);
    }, 0);
  };

  const calculateTotalBudget = () => {
    const activitiesCost = calculateSelectedActivitiesCost();
    const otherCosts = Object.values(editableBudget).reduce((sum, category) => {
      return sum + (typeof category === 'object' ? category.total : category);
    }, 0) - activitiesCost;
    return activitiesCost + otherCosts;
  };

  const getBudgetBreakdown = () => {
    const activitiesCost = calculateSelectedActivitiesCost();
    return {
      activities: { total: activitiesCost, items: [] },
      food: editableBudget.food,
      travel: editableBudget.travel,
      accommodation: editableBudget.accommodation,
      other: editableBudget.other
    };
  };

  const handleBudgetChange = (category, value) => {
    setEditableBudget(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        total: Math.max(0, parseFloat(value) || 0)
      }
    }));
  };

  const handleSaveBudget = () => {
    dispatch({ type: 'SET_BUDGET_BREAKDOWN', payload: editableBudget });
    setIsEditing(false);
  };

  const getSelectedActivities = () => {
    return state.activities.filter(activity => 
      state.selectedActivities.includes(activity.id)
    );
  };

  const getCategoryColor = (category) => {
    const colors = {
      activities: 'bg-blue-500',
      food: 'bg-green-500',
      travel: 'bg-purple-500',
      accommodation: 'bg-orange-500',
      other: 'bg-gray-500'
    };
    return colors[category] || colors.other;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      activities: '🎯',
      food: '🍽️',
      travel: '🚗',
      accommodation: '🏨',
      other: '📋'
    };
    return icons[category] || icons.other;
  };

  const generateItineraryText = () => {
    const selectedActivities = getSelectedActivities();
    const budgetBreakdown = getBudgetBreakdown();
    const totalBudget = calculateTotalBudget();
    
    let content = `TRAVEL ITINERARY\n`;
    content += `================\n\n`;
    
    // Trip Details
    content += `TRIP DETAILS\n`;
    content += `From: ${state.source}\n`;
    content += `To: ${state.place}\n`;
    content += `Trip Type: ${state.motive}\n`;
    content += `Duration: ${state.numberOfDays} days\n`;
    content += `Travelers: ${state.numberOfMembers}\n`;
    content += `Budget: ${state.budget} ${state.currency}\n\n`;
    
    // Daily Itinerary
    content += `DAILY ITINERARY\n`;
    content += `===============\n\n`;
    
    state.itinerary.days.forEach((day, index) => {
      content += `Day ${day.day} - ${day.date}\n`;
      content += `${'='.repeat(20)}\n`;
      
      day.activities.forEach((activity, activityIndex) => {
        content += `${activity.time} - ${activity.activity}\n`;
        content += `Location: ${activity.place}\n`;
        content += `Description: ${activity.description}\n`;
        if (activity.costPerPerson > 0) {
          content += `Cost: ${activity.costPerPerson * state.numberOfMembers} ${state.currency} (${activity.costPerPerson} per person)\n`;
        }
        content += `\n`;
      });
      content += `\n`;
    });
    
    // Selected Activities
    content += `SELECTED ACTIVITIES\n`;
    content += `==================\n\n`;
    
    selectedActivities.forEach((activity, index) => {
      content += `${index + 1}. ${activity.name}\n`;
      content += `   Location: ${activity.place}\n`;
      content += `   Description: ${activity.description}\n`;
      content += `   Cost: ${activity.costPerPerson * state.numberOfMembers} ${state.currency} (${activity.costPerPerson} per person)\n`;
      if (activity.duration) content += `   Duration: ${activity.duration}\n`;
      if (activity.bestTime) content += `   Best Time: ${activity.bestTime}\n`;
      content += `\n`;
    });
    
    // Budget Breakdown
    content += `BUDGET BREAKDOWN\n`;
    content += `================\n\n`;
    
    Object.entries(budgetBreakdown).forEach(([category, data]) => {
      const amount = typeof data === 'object' ? data.total : data;
      const percentage = totalBudget > 0 ? (amount / totalBudget) * 100 : 0;
      
      content += `${category.toUpperCase()}: ${amount} ${state.currency} (${percentage.toFixed(1)}%)\n`;
      
      if (typeof data === 'object' && data.items && data.items.length > 0) {
        data.items.forEach((item, index) => {
          content += `  - ${item.name} (${item.place}): ${item.costPerPerson * state.numberOfMembers} ${state.currency}\n`;
        });
      }
      content += `\n`;
    });
    
    content += `TOTAL BUDGET: ${totalBudget} ${state.currency}\n`;
    content += `PER PERSON: ${state.numberOfMembers > 0 ? Math.round(totalBudget / state.numberOfMembers) : 0} ${state.currency}\n\n`;
    
    content += `Generated on: ${new Date().toLocaleDateString()}\n`;
    content += `Generated by: TravelPocket\n`;
    
    return content;
  };

  const handleDownloadItinerary = () => {
    const content = generateItineraryText();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `itinerary-${state.place.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleShareTrip = () => {
    const content = generateItineraryText();
    
    if (navigator.share) {
      navigator.share({
        title: `Travel Itinerary - ${state.place}`,
        text: content,
      }).catch(console.error);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(content).then(() => {
        alert('Itinerary copied to clipboard!');
      }).catch(() => {
        alert('Unable to copy to clipboard. Please try downloading the itinerary instead.');
      });
    }
  };

  if (!state.itinerary || !state.activities || state.selectedActivities.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Activities Selected</h2>
          <p className="text-gray-600 mb-6">Please go back and select some activities first.</p>
          <button
            onClick={() => navigate('/itinerary')}
            className="btn-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Activities
          </button>
        </div>
      </div>
    );
  }

  const budgetBreakdown = getBudgetBreakdown();
  const totalBudget = calculateTotalBudget();
  const selectedActivities = getSelectedActivities();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/itinerary')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Activities
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Budget Planning
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn-secondary flex items-center"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit Budget'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Budget Summary */}
          <div className="lg:col-span-2">
            <div className="card mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <DollarSign className="w-6 h-6 mr-2" />
                Budget Breakdown
              </h2>

              {/* Budget Categories */}
              <div className="space-y-6">
                {Object.entries(budgetBreakdown).map(([category, data]) => {
                  const amount = typeof data === 'object' ? data.total : data;
                  const items = typeof data === 'object' ? data.items : [];
                  
                  return (
                    <div key={category} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{getCategoryIcon(category)}</span>
                          <div>
                            <h3 className="font-semibold text-gray-900 capitalize">
                              {category === 'activities' ? 'Selected Activities' : category}
                            </h3>
                            {category === 'activities' && (
                              <p className="text-sm text-gray-600">
                                {selectedActivities.length} activities selected
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {isEditing && category !== 'activities' ? (
                            <input
                              type="number"
                              value={editableBudget[category].total}
                              onChange={(e) => handleBudgetChange(category, e.target.value)}
                              className="w-24 px-2 py-1 border border-gray-300 rounded text-right"
                              min="0"
                            />
                          ) : (
                            <span className="text-lg font-semibold text-gray-900">
                              {amount} {state.currency}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Detailed breakdown for non-activities */}
                      {category !== 'activities' && items && items.length > 0 && (
                        <div className="ml-8 space-y-2">
                          {items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center py-2 px-3 bg-white rounded border-l-4 border-gray-300">
                              <div className="flex-1">
                                <div className="flex items-center">
                                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                                  <span className="text-sm text-gray-500 ml-2">• {item.place}</span>
                                </div>
                                <p className="text-sm text-gray-600">{item.description}</p>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-gray-900">
                                  {item.costPerPerson * state.numberOfMembers} {state.currency}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {item.costPerPerson} {state.currency} per person
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Total Budget */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold text-gray-900">Total Budget:</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {totalBudget} {state.currency}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-600">Per Person:</span>
                  <span className="text-lg font-medium text-gray-900">
                    {state.numberOfMembers > 0 ? Math.round(totalBudget / state.numberOfMembers) : 0} {state.currency}
                  </span>
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setEditableBudget(state.budgetBreakdown);
                      setIsEditing(false);
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveBudget}
                    className="btn-primary"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {/* Selected Activities Details */}
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Selected Activities</h3>
              <div className="space-y-3">
                {selectedActivities.map((activity) => (
                  <div key={activity.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{activity.name}</h4>
                      <p className="text-sm text-gray-600">{activity.place}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {activity.costPerPerson * state.numberOfMembers} {state.currency}
                      </div>
                      <div className="text-sm text-gray-600">
                        {activity.costPerPerson} {state.currency} per person
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Budget Visualization */}
          <div>
            <div className="card mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <PieChart className="w-5 h-5 mr-2" />
                Budget Distribution
              </h3>
              <div className="space-y-3">
                {Object.entries(budgetBreakdown).map(([category, data]) => {
                  const amount = typeof data === 'object' ? data.total : data;
                  const percentage = totalBudget > 0 ? (amount / totalBudget) * 100 : 0;
                  return (
                    <div key={category} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 capitalize">
                          {category === 'activities' ? 'Activities' : category}
                        </span>
                        <span className="font-medium">{amount} {state.currency}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getCategoryColor(category)}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 text-right">
                        {percentage.toFixed(1)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                onClick={handleDownloadItinerary}
                className="w-full btn-primary flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Itinerary
              </button>
              <button 
                onClick={handleShareTrip}
                className="w-full btn-secondary flex items-center justify-center"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Trip
              </button>
            </div>

            {/* Trip Summary */}
            <div className="card mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">From:</span>
                  <span className="font-medium">{state.source}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">To:</span>
                  <span className="font-medium">{state.place}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trip Type:</span>
                  <span className="font-medium capitalize">{state.motive}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{state.numberOfDays} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Travelers:</span>
                  <span className="font-medium">{state.numberOfMembers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Activities:</span>
                  <span className="font-medium">{selectedActivities.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Budget:</span>
                  <span className="font-medium">{totalBudget} {state.currency}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPage;
