import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import ItineraryPage from './components/ItineraryPage';
import BudgetPage from './components/BudgetPage';
import { TravelProvider } from './context/TravelContext';

function App() {
  return (
    <TravelProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/itinerary" element={<ItineraryPage />} />
            <Route path="/budget" element={<BudgetPage />} />
          </Routes>
        </div>
      </Router>
    </TravelProvider>
  );
}

export default App;
