// Note: In a real application, you would need to get your API key from environment variables
// For now, we'll use a placeholder that should be replaced with your actual Gemini API key
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || 'your-gemini-api-key-here';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// Helper function to show user-friendly alerts
const showErrorAlert = (errorType) => {
  if (typeof window !== 'undefined') {
    switch (errorType) {
      case 'LLM_SERVICE_UNAVAILABLE':
        alert('🚫 LLM Service Unavailable\n\nThe AI service is currently overloaded and not available. Please try again in a few minutes.\n\nWe\'re using sample data for now so you can still explore the app!');
        break;
      case 'LLM_RATE_LIMIT_EXCEEDED':
        alert('⏰ Rate Limit Exceeded\n\nYou\'ve made too many requests. Please wait a moment before trying again.\n\nWe\'re using sample data for now so you can still explore the app!');
        break;
      case 'LLM_API_KEY_INVALID':
        alert('🔑 API Key Issue\n\nThere\'s an issue with the API configuration. Please check your API key.\n\nWe\'re using sample data for now so you can still explore the app!');
        break;
      default:
        alert('❌ Error Generating Itinerary\n\nSomething went wrong while generating your itinerary. Please try again.\n\nWe\'re using sample data for now so you can still explore the app!');
    }
  }
};

// Helper function to implement exponential backoff retry logic
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      // Only retry on service unavailable errors
      if (error.message === 'LLM_SERVICE_UNAVAILABLE' && attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`Service unavailable, retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
};

// Helper function to validate API key
const validateApiKey = () => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your-gemini-api-key-here') {
    throw new Error('LLM_API_KEY_INVALID');
  }
  return true;
};


// Test function to debug API response
export const testGeminiAPI = async () => {
  try {
    // Validate API key first
    validateApiKey();
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: "Hello, please respond with a simple JSON object: {\"message\": \"Hello World\"}"
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 100,
        }
      })
    });

    console.log('Test API Response Status:', response.status);
    const data = await response.json();
    console.log('Test API Response Data:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Test API Error:', error);
    return null;
  }
};

export const generateItinerary = async (travelData) => {
  const { place, source, motive, budget, currency, includeTravelCost, numberOfMembers, numberOfDays } = travelData;
  
  try {
    // Validate API key first
    validateApiKey();
  
  const prompt = `Create a travel itinerary for ${numberOfMembers} person(s) traveling from ${source} to ${place} for ${numberOfDays} day(s). Motive: ${motive}. Budget: ${budget} ${currency}${includeTravelCost ? ' (including travel costs from ' + source + ' to ' + place + ' and back)' : ' (excluding travel costs)'}.

Generate 20-25 activities for ${place} (sightseeing, tours, experiences only - no food/accommodation/transport in activities array).

Requirements:
- All prices in ${currency}
- Focus on famous ${motive} activities for ${place}
- Keep descriptions brief (1-2 sentences)
- Response under 4000 tokens
${includeTravelCost ? `
IMPORTANT: Include comprehensive travel costs from ${source} to ${place} and back:
- Flight costs (economy, business, first class options)
- Train costs (if applicable)
- Bus costs (if applicable)
- Car rental costs (if applicable)
- Airport transfers and local transportation
- All costs should be realistic and current for ${numberOfMembers} person(s)
- Include both one-way and round-trip options where applicable` : ''}

Return ONLY this JSON structure:
{
  "itinerary": {"days": [{"day": 1, "date": "2024-01-01", "activities": [{"time": "09:00", "activity": "Activity", "place": "Location", "description": "Brief description", "costPerPerson": 50, "category": "activities"}]}]},
  "activities": [{"id": "1", "name": "Activity", "place": "Location", "description": "Brief description", "costPerPerson": 50, "category": "activities", "duration": "2h", "bestTime": "morning"}],
  "budgetBreakdown": {
    "food": {"total": 200, "items": [{"name": "Restaurant", "place": "Location", "costPerPerson": 25, "description": "Meal"}]},
    "travel": {"total": 300, "items": [{"name": "Transport", "place": "Route", "costPerPerson": 50, "description": "Transport"}]},
    "accommodation": {"total": 400, "items": [{"name": "Hotel", "place": "Location", "costPerPerson": 100, "description": "Accommodation"}]},
    "other": {"total": 50, "items": [{"name": "Item", "place": "Location", "costPerPerson": 25, "description": "Item"}]}
  },
  "totalEstimatedCost": 1100
}`;

  // Wrap the API call with retry logic
  const apiCall = async () => {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,        // Lower temperature for more focused responses
          topK: 20,               // Reduced for faster generation
          topP: 0.8,              // Reduced for faster generation
          maxOutputTokens: 16384, // Increased to handle longer responses
          candidateCount: 1,      // Only generate one response
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      
      // Handle specific error cases
      if (response.status === 503) {
        throw new Error('LLM_SERVICE_UNAVAILABLE');
      } else if (response.status === 429) {
        throw new Error('LLM_RATE_LIMIT_EXCEEDED');
      } else if (response.status === 401) {
        throw new Error('LLM_API_KEY_INVALID');
      } else {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
    }

    const data = await response.json();
    return data;
  };

  try {
    console.log('🚀 Starting API call to Gemini...');
    const data = await retryWithBackoff(apiCall);
    
    // Log the full response to debug the structure
    console.log('✅ API call successful, received response:', JSON.stringify(data, null, 2));
    
    // Check if there's an error in the response
    if (data.error) {
      console.error('API returned an error:', data.error);
      throw new Error(`API Error: ${data.error.message || 'Unknown error'}`);
    }
    
    if (!data.candidates || !data.candidates[0]) {
      console.error('No candidates in response:', data);
      throw new Error('Invalid response format from Gemini API - no candidates');
    }
    
    // Check if response was truncated due to token limit
    if (data.candidates[0].finishReason === 'MAX_TOKENS') {
      console.warn('Response was truncated due to MAX_TOKENS limit. Attempting to parse partial response...');
      // Don't immediately fall back to mock data, try to parse what we have
    }
    
    // Check if response was stopped for other reasons
    if (data.candidates[0].finishReason && data.candidates[0].finishReason !== 'STOP' && data.candidates[0].finishReason !== 'MAX_TOKENS') {
      console.warn(`Response finished with reason: ${data.candidates[0].finishReason}. Using mock data instead.`);
      return generateMockResponse(place, source, motive, budget, currency, numberOfMembers, numberOfDays);
    }
    
    if (!data.candidates[0].content) {
      console.error('No content in first candidate:', data.candidates[0]);
      throw new Error('Invalid response format from Gemini API - no content');
    }
    
    if (!data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
      console.error('No parts in content:', data.candidates[0].content);
      throw new Error('Invalid response format from Gemini API - no parts');
    }

    const responseText = data.candidates[0].content.parts[0].text;
    
    console.log('Response text:', responseText);
    console.log('Response text length:', responseText.length);
    
    // Try to parse the JSON response
    try {
      // Clean the response text - remove markdown code blocks if present
      let cleanText = responseText.trim();
      
      // Remove markdown code blocks
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      // Try to find JSON object in the response
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        let jsonText = jsonMatch[0];
        
        // If response was truncated, try to complete the JSON
        if (data.candidates[0].finishReason === 'MAX_TOKENS') {
          console.log('Attempting to fix truncated JSON...');
          
          // Try to close any open arrays or objects
          const openBraces = (jsonText.match(/\{/g) || []).length;
          const closeBraces = (jsonText.match(/\}/g) || []).length;
          const openBrackets = (jsonText.match(/\[/g) || []).length;
          const closeBrackets = (jsonText.match(/\]/g) || []).length;
          
          // Add missing closing brackets/braces
          for (let i = 0; i < openBrackets - closeBrackets; i++) {
            jsonText += ']';
          }
          for (let i = 0; i < openBraces - closeBraces; i++) {
            jsonText += '}';
          }
          
          console.log('Fixed JSON:', jsonText);
        }
        
        const parsedData = JSON.parse(jsonText);
        console.log('Successfully parsed JSON response');
        console.log('Number of activities in response:', parsedData.activities ? parsedData.activities.length : 'No activities array');
        console.log('Activities:', parsedData.activities);
        
        // Validate the response structure
        if (parsedData.activities && Array.isArray(parsedData.activities) && parsedData.activities.length > 0) {
          // Normalize activities - ensure they have the correct category
          const normalizedActivities = parsedData.activities.map((activity, index) => ({
            ...activity,
            id: activity.id || (index + 1).toString(),
            category: activity.category || 'activities'
          }));
          
          console.log('🎉 Using REAL API data with', normalizedActivities.length, 'activities');
          console.log('Normalized activities:', normalizedActivities);
          
          return {
            ...parsedData,
            activities: normalizedActivities
          };
        } else {
          console.warn('⚠️ API response missing required activities array, using mock data');
          return generateMockResponse(place, source, motive, budget, currency, numberOfMembers, numberOfDays);
        }
      } else {
        console.error('No JSON found in response text');
        console.error('Raw response text:', responseText);
        console.warn('⚠️ No valid JSON found in API response, using mock data');
        return generateMockResponse(place, source, motive, budget, currency, numberOfMembers, numberOfDays);
      }
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      console.error('Raw response text:', responseText);
      console.warn('⚠️ JSON parsing failed, using mock data');
      return generateMockResponse(place, source, motive, budget, currency, numberOfMembers, numberOfDays);
    }
    
    } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    // Handle specific error types - only these should show alerts
    if (error.message === 'LLM_SERVICE_UNAVAILABLE') {
      throw new Error('LLM_SERVICE_UNAVAILABLE');
    } else if (error.message === 'LLM_RATE_LIMIT_EXCEEDED') {
      throw new Error('LLM_RATE_LIMIT_EXCEEDED');
    } else if (error.message === 'LLM_API_KEY_INVALID') {
      throw new Error('LLM_API_KEY_INVALID');
    } else {
      // For other API errors, fall back to mock data
      console.warn('API call failed, using mock data:', error.message);
      return generateMockResponse(place, source, motive, budget, currency, numberOfMembers, numberOfDays);
    }
  }
  
  } catch (error) {
    // Handle specific error types - show alert but still provide mock data
    if (error.message === 'LLM_SERVICE_UNAVAILABLE') {
      console.warn('LLM service unavailable, using mock data');
      showErrorAlert('LLM_SERVICE_UNAVAILABLE');
      return generateMockResponse(place, source, motive, budget, currency, numberOfMembers, numberOfDays);
    } else if (error.message === 'LLM_RATE_LIMIT_EXCEEDED') {
      console.warn('Rate limit exceeded, using mock data');
      showErrorAlert('LLM_RATE_LIMIT_EXCEEDED');
      return generateMockResponse(place, source, motive, budget, currency, numberOfMembers, numberOfDays);
    } else if (error.message === 'LLM_API_KEY_INVALID') {
      console.warn('API key invalid, using mock data');
      showErrorAlert('LLM_API_KEY_INVALID');
      return generateMockResponse(place, source, motive, budget, currency, numberOfMembers, numberOfDays);
    } else {
      // For other errors, fall back to mock data
      console.warn('Falling back to mock data due to unexpected error:', error.message);
      showErrorAlert('GENERAL_ERROR');
      return generateMockResponse(place, source, motive, budget, currency, numberOfMembers, numberOfDays);
    }
  }
};

// Mock response generator for development/testing
const generateMockResponse = (place, source, motive, budget, currency, numberOfMembers, numberOfDays) => {
  const mockActivities = [
    {
      id: '1',
      name: 'City Walking Tour',
      place: `${place} Historic Center`,
      description: 'Explore the historic landmarks and cultural sites',
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
      name: 'Scenic Viewpoint',
      place: 'Mountain Lookout',
      description: 'Enjoy panoramic views of the city',
      costPerPerson: 10,
      category: 'activities',
      duration: '1 hour',
      bestTime: 'evening'
    },
    {
      id: '4',
      name: 'Art Gallery Tour',
      place: 'Modern Art Gallery',
      description: 'Discover contemporary local and international art',
      costPerPerson: 20,
      category: 'activities',
      duration: '2 hours',
      bestTime: 'afternoon'
    },
    {
      id: '5',
      name: 'Cultural Workshop',
      place: 'Art Center',
      description: 'Learn traditional crafts and techniques',
      costPerPerson: 45,
      category: 'activities',
      duration: '3 hours',
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
      name: 'Boat Tour',
      place: 'City Harbor',
      description: 'Scenic boat ride with city skyline views',
      costPerPerson: 35,
      category: 'activities',
      duration: '2 hours',
      bestTime: 'afternoon'
    },
    {
      id: '8',
      name: 'Cooking Class',
      place: 'Culinary School',
      description: 'Learn to prepare authentic local dishes',
      costPerPerson: 60,
      category: 'activities',
      duration: '3 hours',
      bestTime: 'morning'
    },
    {
      id: '9',
      name: 'Photography Tour',
      place: 'Historic District',
      description: 'Capture the best shots with a professional guide',
      costPerPerson: 40,
      category: 'activities',
      duration: '2 hours',
      bestTime: 'evening'
    },
    {
      id: '10',
      name: 'Wine Tasting',
      place: 'Local Winery',
      description: 'Sample regional wines and learn about local viticulture',
      costPerPerson: 50,
      category: 'activities',
      duration: '2 hours',
      bestTime: 'afternoon'
    },
    {
      id: '11',
      name: 'Architecture Tour',
      place: 'Downtown District',
      description: 'Explore iconic buildings and architectural styles',
      costPerPerson: 25,
      category: 'activities',
      duration: '2 hours',
      bestTime: 'morning'
    },
    {
      id: '12',
      name: 'Music Performance',
      place: 'Concert Hall',
      description: 'Attend a classical or traditional music concert',
      costPerPerson: 40,
      category: 'activities',
      duration: '2 hours',
      bestTime: 'evening'
    },
    {
      id: '13',
      name: 'Market Tour',
      place: 'Local Market',
      description: 'Explore local markets and taste regional specialties',
      costPerPerson: 20,
      category: 'activities',
      duration: '2 hours',
      bestTime: 'morning'
    },
    {
      id: '14',
      name: 'Bike Tour',
      place: 'City Streets',
      description: 'Cycling tour through scenic neighborhoods',
      costPerPerson: 30,
      category: 'activities',
      duration: '3 hours',
      bestTime: 'morning'
    },
    {
      id: '15',
      name: 'Theater Show',
      place: 'Historic Theater',
      description: 'Watch a local theater production or musical',
      costPerPerson: 35,
      category: 'activities',
      duration: '2 hours',
      bestTime: 'evening'
    },
    {
      id: '16',
      name: 'Garden Tour',
      place: 'Botanical Gardens',
      description: 'Explore beautiful gardens and exotic plants',
      costPerPerson: 15,
      category: 'activities',
      duration: '2 hours',
      bestTime: 'afternoon'
    },
    {
      id: '17',
      name: 'Nightlife Tour',
      place: 'Entertainment District',
      description: 'Experience the local nightlife and bars',
      costPerPerson: 45,
      category: 'activities',
      duration: '3 hours',
      bestTime: 'evening'
    },
    {
      id: '18',
      name: 'Adventure Park',
      place: 'Outdoor Adventure Center',
      description: 'Try zip-lining, rock climbing, and outdoor activities',
      costPerPerson: 55,
      category: 'activities',
      duration: '4 hours',
      bestTime: 'morning'
    },
    {
      id: '19',
      name: 'Historical Site Visit',
      place: 'Ancient Ruins',
      description: 'Explore historical monuments and archaeological sites',
      costPerPerson: 20,
      category: 'activities',
      duration: '2 hours',
      bestTime: 'morning'
    },
    {
      id: '20',
      name: 'Spa Experience',
      place: 'Luxury Spa',
      description: 'Relax with traditional treatments and massages',
      costPerPerson: 80,
      category: 'activities',
      duration: '2 hours',
      bestTime: 'afternoon'
    },
    {
      id: '21',
      name: 'Food Market Tour',
      place: 'Local Market',
      description: 'Explore local cuisine and food culture',
      costPerPerson: 35,
      category: 'activities',
      duration: '2 hours',
      bestTime: 'morning'
    },
    {
      id: '22',
      name: 'Photography Walk',
      place: 'Scenic Routes',
      description: 'Capture the best photo spots with a guide',
      costPerPerson: 40,
      category: 'activities',
      duration: '3 hours',
      bestTime: 'evening'
    },
    {
      id: '23',
      name: 'Local Festival',
      place: 'Town Square',
      description: 'Experience traditional celebrations and events',
      costPerPerson: 15,
      category: 'activities',
      duration: '4 hours',
      bestTime: 'afternoon'
    },
    {
      id: '24',
      name: 'Wine Tasting',
      place: 'Vineyard',
      description: 'Sample local wines and learn about production',
      costPerPerson: 60,
      category: 'activities',
      duration: '2 hours',
      bestTime: 'afternoon'
    },
    {
      id: '25',
      name: 'Hiking Trail',
      place: 'Nature Reserve',
      description: 'Explore scenic hiking paths and nature',
      costPerPerson: 25,
      category: 'activities',
      duration: '4 hours',
      bestTime: 'morning'
    }
  ];

  const budgetAmount = parseInt(budget) || 1000;
  
  // Calculate travel costs from source to destination
  const getTravelCosts = () => {
    const baseCost = Math.floor(budgetAmount * 0.25);
    return {
      total: baseCost,
      items: [
        { name: "Flight", place: `${source} to ${place}`, costPerPerson: Math.floor(baseCost * 0.4), description: `Round-trip flight from ${source} to ${place}` },
        { name: "Airport Transfer", place: "Airport to Hotel", costPerPerson: Math.floor(baseCost * 0.2), description: "Taxi or shuttle service" },
        { name: "Local Transport", place: place, costPerPerson: Math.floor(baseCost * 0.3), description: "Public transport and taxis in destination" },
        { name: "Return Flight", place: `${place} to ${source}`, costPerPerson: Math.floor(baseCost * 0.1), description: `Return flight from ${place} to ${source}` }
      ]
    };
  };
  
  const budgetBreakdown = {
    food: {
      total: Math.floor(budgetAmount * 0.3),
      items: [
        { name: "Local Restaurant", place: "Downtown", costPerPerson: Math.floor(budgetAmount * 0.15), description: "Traditional local cuisine" },
        { name: "Street Food", place: "Market Area", costPerPerson: Math.floor(budgetAmount * 0.1), description: "Authentic street food experience" },
        { name: "Café", place: "City Center", costPerPerson: Math.floor(budgetAmount * 0.05), description: "Coffee and light meals" }
      ]
    },
    travel: getTravelCosts(),
    accommodation: {
      total: Math.floor(budgetAmount * 0.2),
      items: [
        { name: "Hotel", place: "City Center", costPerPerson: Math.floor(budgetAmount * 0.2), description: "Comfortable accommodation" }
      ]
    },
    other: {
      total: Math.floor(budgetAmount * 0.05),
      items: [
        { name: "Souvenirs", place: "Local Shops", costPerPerson: Math.floor(budgetAmount * 0.03), description: "Memorabilia and gifts" },
        { name: "Miscellaneous", place: "Various", costPerPerson: Math.floor(budgetAmount * 0.02), description: "Unexpected expenses" }
      ]
    }
  };

  // Adjust activity prices based on currency (rough conversion for demo)
  const getCurrencyMultiplier = (curr) => {
    const multipliers = {
      'USD': 1.0,
      'EUR': 0.85,
      'GBP': 0.75,
      'JPY': 110,
      'INR': 75,
      'CAD': 1.25,
      'AUD': 1.35
    };
    return multipliers[curr] || 1.0;
  };

  const currencyMultiplier = getCurrencyMultiplier(currency);
  const adjustedActivities = mockActivities.map(activity => ({
    ...activity,
    costPerPerson: Math.round(activity.costPerPerson * currencyMultiplier)
  }));

  // Generate days based on numberOfDays
  const generateDays = () => {
    const days = [];
    for (let i = 1; i <= numberOfDays; i++) {
      const date = new Date(Date.now() + (i - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const activitiesPerDay = Math.ceil(adjustedActivities.length / numberOfDays);
      const startIndex = (i - 1) * activitiesPerDay;
      const endIndex = Math.min(startIndex + activitiesPerDay, adjustedActivities.length);
      
      days.push({
        day: i,
        date: date,
        activities: adjustedActivities.slice(startIndex, endIndex).map(activity => ({
          time: '09:00',
          activity: activity.name,
          place: activity.place,
          description: activity.description,
          costPerPerson: activity.costPerPerson,
          category: activity.category
        }))
      });
    }
    return days;
  };

  return {
    itinerary: {
      days: generateDays()
    },
    activities: adjustedActivities,
    budgetBreakdown,
    totalEstimatedCost: budgetAmount
  };
};
