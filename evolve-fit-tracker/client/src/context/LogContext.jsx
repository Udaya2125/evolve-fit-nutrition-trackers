import React, { createContext, useState, useContext, useCallback } from 'react';
import * as api from '../services/apiService.js';

// Helper function to get the current date in YYYY-MM-DD format
const getTodayISOString = () => {
  return new Date().toISOString().split('T')[0];
};

// 1. Create the Context
export const LogContext = createContext();

// 2. Create a custom hook for easy access to the context
export const useLogContext = () => {
  return useContext(LogContext);
};

// 3. Create the Provider Component
export const LogProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getTodayISOString());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetches logs for a specific date from the API
   * and updates the state.
   */
  const fetchLogs = useCallback(async (dateString) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getLogsByDate(dateString);
      setLogs(data);
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError('Failed to fetch logs.');
      setLogs([]); // Clear logs on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * --- THIS IS THE CORRECT LOCATION ---
   * Deletes a log from the API and then removes it from the local state.
   */
  const deleteLog = useCallback(async (logId) => {
    try {
      await api.deleteLog(logId);
      // After successful API call, update the state
      // This removes the log from the UI instantly
      setLogs((prevLogs) => 
        prevLogs.filter((log) => log._id !== logId)
      );
    } catch (err) {
      console.error('Failed to delete log:', err);
    }
  }, []); // We use useCallback here just like with fetchLogs
  

  // The 'value' object MUST be defined AFTER all the functions it contains.
  // This was line 54, which was causing the error.
  const value = {
    logs,
    selectedDate,
    setSelectedDate,
    isLoading,
    error,
    fetchLogs,
    deleteLog, // Now this is correct
  };

  return <LogContext.Provider value={value}>{children}</LogContext.Provider>;
};