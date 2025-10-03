// Demo data for testing and development
export const demoItinerary = {
  itinerary: {
    days: [
      {
        day: 1,
        date: '2024-03-15',
        activities: [
          {
            time: '09:00',
            activity: 'Arrival & Hotel Check-in',
            place: 'Downtown Hotel',
            description: 'Check into your hotel and freshen up',
            costPerPerson: 0,
            category: 'accommodation'
          },
          {
            time: '11:00',
            activity: 'City Walking Tour',
            place: 'Historic Center',
            description: 'Explore the historic landmarks and cultural sites',
            costPerPerson: 25,
            category: 'activities'
          },
          {
            time: '14:00',
            activity: 'Local Food Experience',
            place: 'Traditional Market',
            description: 'Taste authentic local cuisine and street food',
            costPerPerson: 40,
            category: 'food'
          },
          {
            time: '16:00',
            activity: 'Museum Visit',
            place: 'National Museum',
            description: 'Learn about local history and culture',
            costPerPerson: 15,
            category: 'activities'
          },
          {
            time: '19:00',
            activity: 'Scenic Viewpoint',
            place: 'Mountain Lookout',
            description: 'Enjoy panoramic views of the city',
            costPerPerson: 10,
            category: 'activities'
          }
        ]
      },
      {
        day: 2,
        date: '2024-03-16',
        activities: [
          {
            time: '08:00',
            activity: 'Breakfast',
            place: 'Local Café',
            description: 'Start your day with local breakfast',
            costPerPerson: 20,
            category: 'food'
          },
          {
            time: '10:00',
            activity: 'Nature Hike',
            place: 'National Park',
            description: 'Explore natural trails and wildlife',
            costPerPerson: 30,
            category: 'activities'
          },
          {
            time: '14:00',
            activity: 'Lunch',
            place: 'Mountain Restaurant',
            description: 'Enjoy local cuisine with mountain views',
            costPerPerson: 35,
            category: 'food'
          },
          {
            time: '16:00',
            activity: 'Cultural Workshop',
            place: 'Art Center',
            description: 'Learn traditional crafts and techniques',
            costPerPerson: 45,
            category: 'activities'
          },
          {
            time: '19:00',
            activity: 'Dinner',
            place: 'Fine Dining Restaurant',
            description: 'Experience gourmet local cuisine',
            costPerPerson: 80,
            category: 'food'
          }
        ]
      }
    ]
  },
  activities: [
    {
      id: '1',
      name: 'City Walking Tour',
      place: 'Historic Center',
      description: 'Explore the historic landmarks and cultural sites with a knowledgeable guide',
      costPerPerson: 25,
      category: 'activities',
      duration: '3 hours',
      bestTime: 'morning'
    },
    {
      id: '2',
      name: 'Museum Visit',
      place: 'National Museum',
      description: 'Learn about local history and culture',
      costPerPerson: 15,
      category: 'activities',
      duration: '2 hours',
      bestTime: 'afternoon'
    },
    {
      id: '3',
      name: 'Museum Visit',
      place: 'National Museum',
      description: 'Learn about local history and culture through interactive exhibits',
      costPerPerson: 15,
      category: 'activities',
      duration: '2 hours',
      bestTime: 'afternoon'
    },
    {
      id: '4',
      name: 'Scenic Viewpoint',
      place: 'Mountain Lookout',
      description: 'Enjoy panoramic views of the city and surrounding landscape',
      costPerPerson: 10,
      category: 'activities',
      duration: '1 hour',
      bestTime: 'evening'
    },
    {
      id: '5',
      name: 'Art Gallery Tour',
      place: 'Modern Art Gallery',
      description: 'Discover contemporary local and international art',
      costPerPerson: 20,
      category: 'activities',
      duration: '2 hours',
      bestTime: 'afternoon'
    },
    {
      id: '6',
      name: 'Nature Hike',
      place: 'National Park',
      description: 'Explore natural trails and observe local wildlife',
      costPerPerson: 30,
      category: 'activities',
      duration: '4 hours',
      bestTime: 'morning'
    },
    {
      id: '7',
      name: 'Cultural Workshop',
      place: 'Art Center',
      description: 'Learn traditional crafts and techniques from local artisans',
      costPerPerson: 45,
      category: 'activities',
      duration: '3 hours',
      bestTime: 'afternoon'
    },
    {
      id: '8',
      name: 'Fine Dining Experience',
      place: 'Gourmet Restaurant',
      description: 'Experience world-class local cuisine in an elegant setting',
      costPerPerson: 80,
      category: 'activities',
      duration: '2 hours',
      bestTime: 'evening'
    },
    {
      id: '9',
      name: 'Cultural Workshop',
      place: 'Art Center',
      description: 'Learn traditional crafts and techniques from local artisans',
      costPerPerson: 45,
      category: 'activities',
      duration: '3 hours',
      bestTime: 'afternoon'
    },
    {
      id: '10',
      name: 'Fine Dining Experience',
      place: 'Gourmet Restaurant',
      description: 'Experience world-class local cuisine in an elegant setting',
      costPerPerson: 80,
      category: 'activities',
      duration: '2 hours',
      bestTime: 'evening'
    }
  ],
  budgetBreakdown: {
    food: {
      total: 200,
      items: [
        { name: "Local Restaurant", place: "Downtown", costPerPerson: 100, description: "Traditional local cuisine" },
        { name: "Street Food", place: "Market Area", costPerPerson: 50, description: "Authentic street food experience" },
        { name: "Café", place: "City Center", costPerPerson: 50, description: "Coffee and light meals" }
      ]
    },
    travel: {
      total: 300,
      items: [
        { name: "Airport Transfer", place: "Airport to Hotel", costPerPerson: 100, description: "Taxi or shuttle service" },
        { name: "Local Transport", place: "City", costPerPerson: 100, description: "Public transport and taxis" },
        { name: "Intercity Travel", place: "Between cities", costPerPerson: 100, description: "Train or bus tickets" }
      ]
    },
    activities: {
      total: 150,
      items: []
    },
    accommodation: {
      total: 400,
      items: [
        { name: "Hotel", place: "City Center", costPerPerson: 200, description: "Comfortable accommodation" }
      ]
    },
    other: {
      total: 50,
      items: [
        { name: "Souvenirs", place: "Local Shops", costPerPerson: 30, description: "Memorabilia and gifts" },
        { name: "Miscellaneous", place: "Various", costPerPerson: 20, description: "Unexpected expenses" }
      ]
    }
  },
  totalEstimatedCost: 1100
};

export const demoTravelData = {
  place: 'Paris',
  motive: 'romantic',
  budget: '1000',
  currency: 'USD',
  includeTravelCost: true,
  numberOfMembers: 2,
  numberOfDays: 3
};
