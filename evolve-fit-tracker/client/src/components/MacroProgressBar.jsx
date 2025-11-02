import React from 'react';
import '../index.css';

/**
 * A reusable component to display a progress bar for a macronutrient.
 * @param {object} props
 * @param {string} props.label - The name of the macro (e.g., "Carbs")
 * @param {number} props.current - The current consumed amount
 * @param {number} props.goal - The target goal amount
 * @param {string} props.unit - The unit (e.g., "g")
 */
function MacroProgressBar({ label, current, goal, unit }) {
  // Calculate the percentage, but cap it at 100%
  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  
  const currentRounded = Math.round(current);
  const goalRounded = Math.round(goal);

  return (
    <div className="macro-progress-bar-container">
      <div className="macro-header">
        <span className="macro-label">{label}</span>
        <span className="macro-values">
          {currentRounded}{unit} / {goalRounded}{unit}
        </span>
      </div>
      <div className="progress-bar-background">
        <div
          className="progress-bar-fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

export default MacroProgressBar;

// --- CSS for MacroProgressBar ---
// Please add the following styles to your client/src/index.css file
/*

--- MacroProgressBar Component Styles ---

.macro-progress-bar-container {
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: var(--c-beige);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

.macro-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.macro-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--c-text-primary);
}

.macro-values {
  font-size: 0.9rem;
  color: var(--c-text-light);
}

.progress-bar-background {
  width: 100%;
  height: 8px;
  background-color: var(--c-white);
  border-radius: 4px;
  overflow: hidden; /* Ensures the fill stays inside */
/*
}

.progress-bar-fill {
  height: 100%;
  background-color: var(--c-green-primary);
  border-radius: 4px;
  transition: width 0.3s ease-in-out;
}
*/