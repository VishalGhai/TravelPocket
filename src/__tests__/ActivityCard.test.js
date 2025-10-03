import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ActivityCard from '../components/ActivityCard';

const mockActivity = {
  id: '1',
  name: 'City Walking Tour',
  place: 'Historic Center',
  description: 'Explore the historic landmarks and cultural sites',
  costPerPerson: 25,
  category: 'activities',
  duration: '3 hours',
  bestTime: 'morning'
};

const mockOnToggle = jest.fn();

describe('ActivityCard', () => {
  beforeEach(() => {
    mockOnToggle.mockClear();
  });

  test('renders activity information correctly', () => {
    render(
      <ActivityCard
        activity={mockActivity}
        isSelected={false}
        onToggle={mockOnToggle}
        currency="USD"
      />
    );

    expect(screen.getByText('City Walking Tour')).toBeInTheDocument();
    expect(screen.getByText('Historic Center')).toBeInTheDocument();
    expect(screen.getByText('Explore the historic landmarks and cultural sites')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('per person')).toBeInTheDocument();
  });

  test('displays category and duration badges', () => {
    render(
      <ActivityCard
        activity={mockActivity}
        isSelected={false}
        onToggle={mockOnToggle}
        currency="USD"
      />
    );

    expect(screen.getByText('Activities')).toBeInTheDocument();
    expect(screen.getByText('3 hours')).toBeInTheDocument();
    expect(screen.getByText('morning')).toBeInTheDocument();
  });

  test('shows correct toggle button state when not selected', () => {
    render(
      <ActivityCard
        activity={mockActivity}
        isSelected={false}
        onToggle={mockOnToggle}
        currency="USD"
      />
    );

    const toggleButton = screen.getByTitle('Add to budget');
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveClass('bg-gray-200');
  });

  test('shows correct toggle button state when selected', () => {
    render(
      <ActivityCard
        activity={mockActivity}
        isSelected={true}
        onToggle={mockOnToggle}
        currency="USD"
      />
    );

    const toggleButton = screen.getByTitle('Remove from budget');
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveClass('bg-green-500');
    expect(screen.getByText('Added to budget')).toBeInTheDocument();
  });

  test('calls onToggle when toggle button is clicked', () => {
    render(
      <ActivityCard
        activity={mockActivity}
        isSelected={false}
        onToggle={mockOnToggle}
        currency="USD"
      />
    );

    const toggleButton = screen.getByTitle('Add to budget');
    fireEvent.click(toggleButton);

    expect(mockOnToggle).toHaveBeenCalledWith('1');
  });

  test('applies selected styling when isSelected is true', () => {
    render(
      <ActivityCard
        activity={mockActivity}
        isSelected={true}
        onToggle={mockOnToggle}
        currency="USD"
      />
    );

    const card = screen.getByText('City Walking Tour').closest('.activity-card');
    expect(card).toHaveClass('ring-2', 'ring-primary-500', 'bg-primary-50');
  });

  test('handles different activity categories', () => {
    const foodActivity = { ...mockActivity, category: 'food' };
    
    render(
      <ActivityCard
        activity={foodActivity}
        isSelected={false}
        onToggle={mockOnToggle}
        currency="USD"
      />
    );

    expect(screen.getByText('Food')).toBeInTheDocument();
  });

  test('handles missing optional fields gracefully', () => {
    const minimalActivity = {
      id: '2',
      name: 'Simple Activity',
      place: 'Some Place',
      description: 'A simple activity',
      costPerPerson: 10,
      category: 'other'
    };

    render(
      <ActivityCard
        activity={minimalActivity}
        isSelected={false}
        onToggle={mockOnToggle}
        currency="USD"
      />
    );

    expect(screen.getByText('Simple Activity')).toBeInTheDocument();
    expect(screen.getByText('Some Place')).toBeInTheDocument();
    expect(screen.getByText('A simple activity')).toBeInTheDocument();
  });

  test('displays currency correctly', () => {
    render(
      <ActivityCard
        activity={mockActivity}
        isSelected={false}
        onToggle={mockOnToggle}
        currency="EUR"
      />
    );

    expect(screen.getByText('25 EUR')).toBeInTheDocument();
  });
});
