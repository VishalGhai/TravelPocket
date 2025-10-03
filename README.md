# TravelPocket - AI-Powered Travel Planning App

TravelPocket is a comprehensive React application that uses AI to generate personalized travel itineraries based on your preferences, budget, and travel requirements.

## Features

- **AI-Powered Itinerary Generation**: Uses Google Gemini API to create detailed travel plans
- **Interactive Activity Selection**: Choose activities with tick/cross buttons
- **Budget Management**: Track expenses across different categories
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Budget Calculation**: See costs update as you select activities
- **Comprehensive Testing**: Full test coverage for all components and functions

## Tech Stack

- **Frontend**: React 18, React Router DOM
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **API Integration**: Google Gemini API
- **Testing**: Jest, React Testing Library
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd TravelPocket
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add your Gemini API key:
```
REACT_APP_GEMINI_API_KEY=your-gemini-api-key-here
```

**Getting your Gemini API Key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key and replace `your-gemini-api-key-here` in your `.env` file

**Important:** Make sure to restart your development server after adding the API key.

4. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

### Running Tests

```bash
npm test
```

## Project Structure

```
src/
├── components/
│   ├── MainPage.js          # Landing page with form inputs
│   ├── ItineraryPage.js     # Activity selection and itinerary display
│   ├── BudgetPage.js        # Budget planning and final summary
│   └── ActivityCard.js      # Individual activity component
├── context/
│   └── TravelContext.js     # State management
├── services/
│   └── geminiApi.js         # API integration
├── __tests__/
│   ├── MainPage.test.js     # Main page tests
│   ├── ActivityCard.test.js # Activity card tests
│   ├── TravelContext.test.js # Context tests
│   └── geminiApi.test.js    # API tests
└── setupTests.js            # Test configuration
```

## Usage

### 1. Plan Your Trip
- Enter your destination
- Select trip motive (romantic, educative, nature, etc.)
- Set your budget and currency
- Choose number of travelers
- Toggle travel cost inclusion

### 2. Select Activities
- Review AI-generated activities
- Use tick/cross buttons to select/deselect activities
- See real-time budget updates
- View detailed activity information

### 3. Manage Budget
- Review budget breakdown by category
- Edit budget allocations
- View final cost summary
- Download or share your itinerary

## API Integration

The app integrates with Google Gemini API for itinerary generation. The API call includes:
- Destination and trip preferences
- Budget constraints
- Number of travelers
- Travel cost inclusion preference

### Mock Data
If the API is unavailable, the app falls back to mock data to ensure functionality.

## Testing

The application includes comprehensive tests covering:
- Component rendering and interactions
- State management
- API integration
- Form validation
- Error handling

Run tests with:
```bash
npm test
```

## Responsive Design

The app is fully responsive with:
- Mobile-first design approach
- Flexible grid layouts
- Touch-friendly interactions
- Optimized for all screen sizes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Troubleshooting

### Common Issues

#### LLM_SERVICE_UNAVAILABLE Error
If you encounter this error, it means the Gemini API service is temporarily overloaded. The app will:
- Automatically retry the request with exponential backoff (up to 3 attempts)
- Fall back to mock data if the service remains unavailable
- Show a user-friendly error message

**Solutions:**
1. Wait a few minutes and try again
2. Check the [Gemini API Status Page](https://status.gemini.com) for service updates
3. Ensure your API key is valid and has sufficient quota

#### API Key Issues
If you see "API Key Issue" alerts:
1. Verify your API key is correctly set in the `.env` file
2. Make sure the key starts with `AIza...`
3. Restart your development server after updating the `.env` file
4. Check that your API key has the necessary permissions

#### Rate Limit Exceeded
If you hit rate limits:
1. Wait a few minutes before making new requests
2. Consider upgrading your API quota if needed
3. The app will automatically retry with backoff

### Mock Data Fallback
The app includes comprehensive mock data that activates when:
- API service is unavailable
- Rate limits are exceeded
- API key is invalid
- Network connectivity issues

This ensures you can always explore the app's functionality even without API access.

## Support

For support or questions, please open an issue in the repository.
