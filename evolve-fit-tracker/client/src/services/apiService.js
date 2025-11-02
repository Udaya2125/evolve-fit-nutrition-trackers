import axios from 'axios';

/**
 * Searches for food items based on a query.
 * @param {string} query - The user's search term.
 * @returns {Promise<Array>} A promise that resolves to an array of food results.
 */
export const searchFood = async (query) => {
  try {
    // We can use a relative URL '/api/search' because of the proxy
    // we set up in vite.config.js.
    const response = await axios.get(`/api/search?q=${query}`);
    return response.data;
  } catch (error) {
    console.error('Error searching food:', error);
    throw error; // Re-throw error to be handled by the component
  }
};

/**
 * Fetches the detailed nutritional information for a single food item.
 * @param {string} foodName - The exact name of the food.
 * @returns {Promise<Object>} A promise that resolves to the food item's data.
 */
export const getFoodDetails = async (foodName) => {
  try {
    const response = await axios.get(`/api/food?name=${encodeURIComponent(foodName)}`);
    return response.data;
  } catch (error) {
    console.error('Error getting food details:', error);
    throw error;
  }
};

/**
 * Saves a new food log entry to the database.
 * @param {Object} logEntry - The complete log object to be saved.
 * @returns {Promise<Object>} A promise that resolves to the saved log object.
 */
export const logFood = async (logEntry) => {
  try {
    const response = await axios.post('/api/log', logEntry);
    return response.data;
  } catch (error) {
    console.error('Error logging food:', error);
    throw error;
  }
};

/**
 * Fetches all food logs for a specific date.
 * @param {string} dateString - The date in YYYY-MM-DD format.
 * @returns {Promise<Array>} A promise that resolves to an array of log objects.
 */
export const getLogsByDate = async (dateString) => {
  try {
    const response = await axios.get(`/api/log/date?date=${dateString}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching logs by date:', error);
    throw error;
  }
};

/**
 * Deletes a food log from the database.
 * @param {string} logId - The _id of the log to delete.
 * @returns {Promise<Object>} A promise that resolves to the server's response.
 */
export const deleteLog = async (logId) => {
  try {
    // We use axios.delete and pass the ID in the URL
    const response = await axios.delete(`/api/log/${logId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting log:', error);
    throw error;
  }
};