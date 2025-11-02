import React, { useState, useEffect } from 'react';
// 1. IMPORT useParams
import { Link, useNavigate, useParams } from 'react-router-dom'; 
import * as api from '../services/apiService.js';
import '../index.css';

function AddFood() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // 2. GET mealType FROM THE URL
  const { mealType } = useParams();

  // This useEffect hook runs every time the 'query' state changes
  useEffect(() => {
    // Don't search if the query is too short
    if (query.length < 2) {
      setResults([]); // Clear results if query is short
      return;
    }

    setIsLoading(true);

    // This is a debouncing "timeout"
    const delayDebounce = setTimeout(async () => {
      try {
        const data = await api.searchFood(query);
        setResults(data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    // This cleanup function cancels the timeout if the user types again
    return () => clearTimeout(delayDebounce);
  }, [query]); // The effect's dependency is the 'query'

  return (
    <div className="add-food-container">
      <div className="header">
        {/* 3. Changed this to navigate to dashboard, not just "back" */}
        <button onClick={() => navigate('/')} className="back-btn">&larr;</button>
        
        {/* 4. UPDATE HEADER to show mealType */}
        <h2 className="header-title">Log Food ({mealType})</h2>
      </div>

      {/* Search Bar (no changes) */}
      <div className="search-bar-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for food..."
          className="form-input search-bar"
        />
      </div>

      {/* Results List */}
      <div className="search-results">
        {isLoading && <p>Loading...</p>}
        
        {!isLoading && results.length > 0 && (
          <ul className="results-list">
            {results.map((food, index) => (
              <li key={index} className="result-item">
                
                {/* 5. UPDATE THE LINK to include mealType */}
                <Link to={`/log-food/${mealType}/${encodeURIComponent(food['Dish Name'])}`}>
                    <span className="food-name">{food['Dish Name']}</span>
                    <span className="food-serving">{food['Calories (kcal)']} kcal</span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {!isLoading && query.length > 1 && results.length === 0 && (
          <p className="no-results">No food found. Try another name.</p>
        )}
      </div>
    </div>
  );
}

// The CSS comment block is correctly placed and does not need to be changed.
// Please add the following to your client/src/index.css file:
/*
--- AddFood Component Styles ---

.header {
...
*/

export default AddFood;