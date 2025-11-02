import React, { useContext, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogContext } from '../context/LogContext.jsx';
import MacroProgressBar from './MacroProgressBar.jsx';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import '../index.css';

// --- Daily Goals (as specified in your prompt) ---
const DAILY_GOALS = {
  calories: 2200,
  carbs: 275,
  fat: 70,
  fiber: 30,
  protein: 110,
};

function Dashboard() {
  const { 
    selectedDate, 
    setSelectedDate, 
    logs, 
    fetchLogs, 
    isLoading,
    deleteLog  // Get the delete function from context
  } = useContext(LogContext);
  
  const navigate = useNavigate();

  // --- Fetch Logs ---
  useEffect(() => {
    fetchLogs(selectedDate);
  }, [selectedDate, fetchLogs]);

  // --- Calculate Totals (This is unchanged) ---
  const totals = useMemo(() => {
    const calculatedTotals = {
      calories: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      protein: 0,
    };

    logs.forEach(log => {
      calculatedTotals.calories += log.calories;
      calculatedTotals.carbs += log.carbs;
      calculatedTotals.fat += log.fat;
      calculatedTotals.fiber += log.fiber;
      calculatedTotals.protein += log.protein;
    });

    return calculatedTotals;
  }, [logs]);

  // --- Helper Functions (These are unchanged) ---
  const getISODateString = (date) => {
    return date.toISOString().split('T')[0];
  };

  const changeDate = (days) => {
    setSelectedDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + days);
      return getISODateString(newDate);
    });
  };

  const formatDateForDisplay = (dateString) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const date = new Date(dateString);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const caloriePercentage = (totals.calories / DAILY_GOALS.calories) * 100;

  // --- NEW: Helper function to filter logs for a specific meal ---
  const getLogsByMeal = (mealType) => {
    return logs.filter(log => log.mealType === mealType);
  };


  return (
    <div className="dashboard-container">
      {/* --- Header (Unchanged) --- */}
      <div className="dashboard-header">
        <h1 className="brand-title">Evolve Fit</h1>
      </div>

      {/* --- Date Navigator (Unchanged) --- */}
      <div className="date-navigator">
        <button onClick={() => changeDate(-1)} className="date-btn">&larr;</button>
        <h2 className="current-date">{formatDateForDisplay(selectedDate)}</h2>
        <button onClick={() => changeDate(1)} className="date-btn">&rarr;</button>
      </div>

      {/* --- Calorie Tracker Card (Unchanged) --- */}
      <div className="card calorie-card">
        <div className="calorie-progress-bar">
          <CircularProgressbar
            value={caloriePercentage}
            text={`${Math.round(totals.calories)}`}
            styles={buildStyles({
              pathColor: 'var(--c-green-primary)',
              textColor: 'var(--c-text-primary)',
              trailColor: '#e0e0e0',
            })}
          />
        </div>
        <div className="calorie-text">
          <span className="calorie-label">kcal</span>
          <span className="calorie-goal">/ {DAILY_GOALS.calories}</span>
        </div>
      </div>

      {/* --- Macro Trackers (Unchanged) --- */}
      <div className="macro-grid">
        <MacroProgressBar 
          label="Carbs" 
          current={totals.carbs} 
          goal={DAILY_GOALS.carbs} 
          unit="g" 
        />
        <MacroProgressBar 
          label="Protein" 
          current={totals.protein} 
          goal={DAILY_GOALS.protein} 
          unit="g" 
        />
        <MacroProgressBar 
          label="Fat" 
          current={totals.fat} 
          goal={DAILY_GOALS.fat} 
          unit="g" 
        />
        <MacroProgressBar 
          label="Fiber" 
          current={totals.fiber} 
          goal={DAILY_GOALS.fiber} 
          unit="g" 
        />
      </div>

      {/* --- Meal Cards (MODIFIED) --- */}
      <div className="meal-section">
        {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((mealType) => {
          
          // NEW: Get the logs just for this meal
          const mealLogs = getLogsByMeal(mealType);
          
          return (
            <div className="card meal-card" key={mealType}>
              <div className="meal-card-header">
                <h3>{mealType}</h3>
                <button 
                  className="add-meal-btn" 
                  // MODIFIED: Pass mealType in the URL
                  onClick={() => navigate(`/add-food/${mealType}`)}
                >
                  +
                </button>
              </div>

              {/* NEW: Log list for this specific meal */}
              <ul className="meal-log-list">
                {isLoading ? (
                  <p className="empty-log-mini">Loading...</p>
                ) : mealLogs.length > 0 ? (
                  mealLogs.map(log => (
                    <li key={log._id} className="log-item-mini">
                      <span className="log-item-name-mini">{log.foodName} ({log.quantity})</span>
                      <div className="log-item-actions-mini">
                        <span className="log-item-calories-mini">{Math.round(log.calories)} kcal</span>
                        <button 
                          className="delete-log-btn-mini"
                          onClick={() => deleteLog(log._id)}
                        >
                          &times;
                        </button>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="empty-log-mini">No items logged.</p>
                )}
              </ul>
            </div>
          );
        })}
      </div>

      {/* --- Logged Items List (DELETED) --- */}
      
    </div>
  );
}

export default Dashboard;
