import React from 'react';
import { Check, Clock, MapPin } from 'lucide-react';

const ActivityCard = ({ activity, isSelected, onToggle, currency = 'INR' }) => {
  const getCategoryColor = (category) => {
    const colors = {
      activities: 'bg-blue-100 text-blue-800',
      food: 'bg-green-100 text-green-800',
      travel: 'bg-purple-100 text-purple-800',
      accommodation: 'bg-orange-100 text-orange-800',
      other: 'bg-gray-100 text-gray-800'
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

  return (
    <div className={`activity-card ${isSelected ? 'ring-2 ring-primary-500 bg-primary-50' : ''}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {activity.place}
          </h3>
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{activity.name}</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onToggle(activity.id)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isSelected
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
            }`}
            title={isSelected ? 'Remove from budget' : 'Add to budget'}
          >
            <Check className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-3">{activity.description}</p>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(activity.category)}`}>
          {getCategoryIcon(activity.category)} {activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}
        </span>
        {activity.duration && (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {activity.duration}
          </span>
        )}
        {activity.bestTime && (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
            {activity.bestTime}
          </span>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center text-lg font-semibold text-gray-900">
          {activity.costPerPerson} {currency}
          <span className="text-sm text-gray-600 ml-1">per person</span>
        </div>
        {isSelected && (
          <span className="text-sm text-green-600 font-medium">Added to budget</span>
        )}
      </div>
    </div>
  );
};

export default ActivityCard;
