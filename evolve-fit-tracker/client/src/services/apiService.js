import axios from 'axios';

// Create an Axios instance with a base URL from environment variables
const apiClient = axios.create({
  // This line reads the VITE_API_URL variable you set in Vercel
  baseURL: import.meta.env.VITE_API_URL,
});


/**
 * Searches for food items based on a query.
 * @param {string} query - The user's search term.
 * @returns {Promise<Array>} A promise that resolves to an array of food results.
 */
export const searchFood = async (query) => {
  try {
    // Changed to use apiClient
    const response = await apiClient.get(`/search?q=${query}`);
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
    // Changed to use apiClient
    const response = await apiClient.get(`/food?name=${encodeURIComponent(foodName)}`);
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
    // Changed to use apiClient
    const response = await apiClient.post('/log', logEntry);
    return response.data;
  } catch (error) {
    console.error('Error logging food:', error);
    throw error;
  }
};

/**
 * Fetches all food logs for a specific date.
 * @param {string} dateString - The date in YYYY-MM-DD format.
 * @returns {Promise<Array>} A promise that resolves to an array of food objects.
 */
export const getLogsByDate = async (dateString) => {
  try {
    // Changed to use apiClient
    const response = await apiClient.get(`/log/date?date=${dateString}`);
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
    // Changed to use apiClient
    const response = await apiClient.delete(`/log/${logId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting log:', error);
    throw error;
  }
};
