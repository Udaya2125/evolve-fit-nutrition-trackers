import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import ALL your page components
import Dashboard from './components/Dashboard.jsx'; 
import AddFood from './components/AddFood.jsx';     
import LogFood from './components/LogFood.jsx';     

// Import your context provider
import { LogProvider } from './context/LogContext.jsx';

function App() {
  return (
    // The LogProvider wraps the entire app,
    // so all components can share the same state.
    <LogProvider>
      <Router>
        <div className="app-container">
          <Routes>
            {/* Route 1: The Homepage (No change) */}
            <Route 
              path="/" 
              element={<Dashboard />} 
            />
            
            {/* Route 2: The Search Food Page (NOW INCLUDES :mealType) */}
            <Route 
              path="/add-food/:mealType" 
              element={<AddFood />} 
            />

            {/* Route 3: The Log Food Page (NOW INCLUDES :mealType) */}
            <Route 
              path="/log-food/:mealType/:foodName" 
              element={<LogFood />} 
            />
          </Routes>
        </div>
      </Router>
    </LogProvider>
  );
}

export default App;