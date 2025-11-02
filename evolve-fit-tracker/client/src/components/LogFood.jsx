import React, { useState, useEffect, useContext } from 'react';
// 1. UPDATE useParams (it's already imported)
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../services/apiService.js';
import { LogContext } from '../context/LogContext.jsx';
import '../index.css';

function LogFood() {
  // 2. GET BOTH mealType AND foodName FROM THE URL
  const { mealType, foodName } = useParams();
  const navigate = useNavigate();
  const { fetchLogs, selectedDate } = useContext(LogContext);

  const [quantity, setQuantity] = useState(1);
  const [baseFoodData, setBaseFoodData] = useState(null); // Data for 1 serving
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the food's base data when the component loads
  useEffect(() => {
    const getFoodData = async () => {
      try {
        setIsLoading(true);
        // We use decodeURIComponent to handle food names with spaces
        const data = await api.getFoodDetails(decodeURIComponent(foodName));
        setBaseFoodData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching food details:', err);
        setError('Failed to load food data.');
      } finally {
        setIsLoading(false);
      }
    };

    getFoodData();
  }, [foodName]); // Rerun if the foodName in the URL changes

  // This function calculates the final nutrition based on quantity
  const calculateNutrition = (field) => {
    if (!baseFoodData || !baseFoodData[field]) {
      return 0;
    }
    // Parse the value from CSV (which might be a string) and multiply
    const value = parseFloat(baseFoodData[field]);
    // We return the raw number here. We will format it later.
    return (value * quantity);
  };

  const handleLogFood = async () => {
    if (!baseFoodData) return;

    // Create the final log object with calculated values
    const logEntry = {
        foodName: baseFoodData['Dish Name'],
        servingSize: '1 serving', // Hardcoded since CSV doesn't have it
        quantity: quantity,
        calories: calculateNutrition('Calories (kcal)'),
        carbs: calculateNutrition('Carbohydrates (g)'),
        fat: calculateNutrition('Fats (g)'), // Corrected from 'Fat (g)'
        fiber: calculateNutrition('Fibre (g)'),
        protein: calculateNutrition('Protein (g)'),
        mealType: mealType, // <-- 3. ADD THE MEALTYPE HERE
    };

    try {
      // Send the new log to the backend API to be saved in MongoDB
      await api.logFood(logEntry);
      
      // After logging, refresh the logs on the dashboard
      await fetchLogs(selectedDate);
      
      // Go back to the dashboard
      navigate('/');
      
    } catch (err) {
      console.error('Failed to log food:', err);
      setError('Failed to save log. Please try again.');
    }
  };

  // --- Render ---

  if (isLoading) {
    return <div className="loading-text">Loading food details...</div>;
  }

  if (error) {
    return <div className="error-text">{error}</div>;
  }

  if (!baseFoodData) {
    return <div className="error-text">Food not found.</div>;
  }

  return (
    <div className="log-food-container">
      <div className="header">
        <button onClick={() => navigate(-1)} className="back-btn">&larr;</button>
        <h2 className="header-title">Log Food</h2>
      </div>

      {/* --- Food Details Card --- */}
      <div className="card log-details-card">
        {/* CORRECTED: Using 'Dish Name' */}
        <h3 className="food-title">{baseFoodData['Dish Name']}</h3>
        
        {/* CORRECTED: Hardcoded 'Serving Size' */}
        <p className="food-serving-size">Serving Size: 1 serving (approx)</p>

        <div className="quantity-control">
          <label htmlFor="quantity">Number of Servings</label>
          <input
            id="quantity"
            type="number"
            value={quantity}
            // --- EDITED LINES ---
            onChange={(e) => setQuantity(Math.max(0.5, parseFloat(e.target.value)) || 0.5)}
            min="0.5"
            step="0.5"
            // --------------------
            className="form-input quantity-input"
          />
        </div>
      </div>

      {/* --- Calculated Nutrition Card --- */}
      <div className="card nutrition-summary-card">
        <h4>Nutrition Summary</h4>
        <ul className="nutrition-list">
          <li>
            <span>Calories</span>
            {/* CORRECTED: Using 'Calories (kcal)' */}
            <span>{calculateNutrition('Calories (kcal)').toFixed(1)} kcal</span>
          </li>
          <li>
            <span>Carbs</span>
            <span>{calculateNutrition('Carbohydrates (g)').toFixed(1)} g</span>
          </li>
          <li>
            <span>Protein</span>
            <span>{calculateNutrition('Protein (g)').toFixed(1)} g</span>
          </li>
          <li>
            <span>Fat</span>
            {/* CORRECTED: Using 'Fats (g)' */}
            <span>{calculateNutrition('Fats (g)').toFixed(1)} g</span>
          </li>
          <li>
            <span>Fiber</span>
            <span>{calculateNutrition('Fibre (g)').toFixed(1)} g</span>
          </li>
        </ul>
      </div>

      {/* --- Log Button --- */}
      <button 
        onClick={handleLogFood} 
        className="btn btn-primary btn-log-food"
      >
        LOG FOOD
      </button>
    </div>
  );
}

export default LogFood;

// The CSS comment block is correct.
/*
--- LogFood Component Styles ---
...
*/