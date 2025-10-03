import { generateItinerary } from '../services/geminiApi';

// Mock fetch globally
global.fetch = jest.fn();

describe('geminiApi', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('generates itinerary with valid data', async () => {
    const mockResponse = {
      candidates: [{
        content: {
          parts: [{
            text: JSON.stringify({
              itinerary: { days: [{ day: 1, activities: [] }] },
              activities: [{ id: '1', name: 'Test Activity', costPerPerson: 25 }],
              budgetBreakdown: { food: 200, travel: 300, activities: 150, accommodation: 400, other: 50 },
              totalEstimatedCost: 1100
            })
          }]
        }
      }]
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const travelData = {
      place: 'Paris',
      motive: 'romantic',
      budget: '1000',
      currency: 'USD',
      includeTravelCost: true,
      numberOfMembers: 2
    };

    const result = await generateItinerary(travelData);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('generativelanguage.googleapis.com'),
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining('Paris')
      })
    );

    expect(result).toHaveProperty('itinerary');
    expect(result).toHaveProperty('activities');
    expect(result).toHaveProperty('budgetBreakdown');
  });

  test('handles API errors gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const travelData = {
      place: 'Paris',
      motive: 'romantic',
      budget: '1000',
      currency: 'USD',
      includeTravelCost: true,
      numberOfMembers: 2
    };

    const result = await generateItinerary(travelData);

    // Should return mock data when API fails
    expect(result).toHaveProperty('itinerary');
    expect(result).toHaveProperty('activities');
    expect(result).toHaveProperty('budgetBreakdown');
    expect(result.activities).toHaveLength(5); // Mock data has 5 activities
  });

  test('handles invalid API response format', async () => {
    const mockResponse = {
      candidates: [{
        content: {
          parts: [{
            text: 'Invalid JSON response'
          }]
        }
      }]
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const travelData = {
      place: 'Paris',
      motive: 'romantic',
      budget: '1000',
      currency: 'USD',
      includeTravelCost: true,
      numberOfMembers: 2
    };

    const result = await generateItinerary(travelData);

    // Should return mock data when JSON parsing fails
    expect(result).toHaveProperty('itinerary');
    expect(result).toHaveProperty('activities');
    expect(result).toHaveProperty('budgetBreakdown');
  });

  test('handles API response without candidates', async () => {
    const mockResponse = {};

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const travelData = {
      place: 'Paris',
      motive: 'romantic',
      budget: '1000',
      currency: 'USD',
      includeTravelCost: true,
      numberOfMembers: 2
    };

    const result = await generateItinerary(travelData);

    // Should return mock data when response format is invalid
    expect(result).toHaveProperty('itinerary');
    expect(result).toHaveProperty('activities');
    expect(result).toHaveProperty('budgetBreakdown');
  });

  test('handles non-ok API response', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400
    });

    const travelData = {
      place: 'Paris',
      motive: 'romantic',
      budget: '1000',
      currency: 'USD',
      includeTravelCost: true,
      numberOfMembers: 2
    };

    const result = await generateItinerary(travelData);

    // Should return mock data when API returns error
    expect(result).toHaveProperty('itinerary');
    expect(result).toHaveProperty('activities');
    expect(result).toHaveProperty('budgetBreakdown');
  });

  test('generates appropriate prompt for different trip types', async () => {
    const travelData = {
      place: 'Tokyo',
      motive: 'cultural',
      budget: '2000',
      currency: 'JPY',
      includeTravelCost: false,
      numberOfMembers: 4
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [{
          content: {
            parts: [{
              text: JSON.stringify({
                itinerary: { days: [] },
                activities: [],
                budgetBreakdown: {},
                totalEstimatedCost: 0
              })
            }]
          }
        }]
      })
    });

    await generateItinerary(travelData);

    const callArgs = fetch.mock.calls[0];
    const requestBody = JSON.parse(callArgs[1].body);
    const prompt = requestBody.contents[0].parts[0].text;

    expect(prompt).toContain('Tokyo');
    expect(prompt).toContain('cultural');
    expect(prompt).toContain('2000');
    expect(prompt).toContain('JPY');
    expect(prompt).toContain('4 person(s)');
    expect(prompt).toContain('excluding travel costs');
  });

  test('generates appropriate prompt when including travel costs', async () => {
    const travelData = {
      place: 'London',
      motive: 'romantic',
      budget: '1500',
      currency: 'GBP',
      includeTravelCost: true,
      numberOfMembers: 2
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [{
          content: {
            parts: [{
              text: JSON.stringify({
                itinerary: { days: [] },
                activities: [],
                budgetBreakdown: {},
                totalEstimatedCost: 0
              })
            }]
          }
        }]
      })
    });

    await generateItinerary(travelData);

    const callArgs = fetch.mock.calls[0];
    const requestBody = JSON.parse(callArgs[1].body);
    const prompt = requestBody.contents[0].parts[0].text;

    expect(prompt).toContain('including travel costs');
  });

  test('returns mock data with correct structure', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const travelData = {
      place: 'Barcelona',
      motive: 'nature',
      budget: '800',
      currency: 'EUR',
      includeTravelCost: true,
      numberOfMembers: 1
    };

    const result = await generateItinerary(travelData);

    expect(result).toHaveProperty('itinerary');
    expect(result).toHaveProperty('activities');
    expect(result).toHaveProperty('budgetBreakdown');
    expect(result).toHaveProperty('totalEstimatedCost');

    expect(result.itinerary).toHaveProperty('days');
    expect(Array.isArray(result.itinerary.days)).toBe(true);
    expect(Array.isArray(result.activities)).toBe(true);
    expect(typeof result.budgetBreakdown).toBe('object');
    expect(typeof result.totalEstimatedCost).toBe('number');
  });
});
