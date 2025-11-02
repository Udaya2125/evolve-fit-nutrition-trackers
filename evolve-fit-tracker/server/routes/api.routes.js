import express from 'express';
import FoodLog from '../models/log.model.js';

// Create a new router
const router = express.Router();

// --- API Endpoints ---

/**
 * @route   GET /api/search
 * @desc    Search for a food item from the in-memory CSV data
 * @access  Public
 * @query   ?q=[search_term]
 */
router.get('/search', (req, res) => {
  try {
    const query = req.query.q ? req.query.q.toLowerCase() : '';
    
    // Get the foodData array we loaded in server.js
    const foodData = req.app.locals.foodData;

    // (I removed the console.log test line from here)

    if (!query) {
      return res.json([]);
    }

    // Filter the data
    const results = foodData
      .filter(food => 
        food['Dish Name'] && food['Dish Name'].toLowerCase().includes(query)
      )
      .slice(0, 10); // Return only the top 10 matches

    res.json(results);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   GET /api/food
 * @desc    Get full nutritional details for a single food item
 * @access  Public
 * @query   ?name=[food_name]
 */
router.get('/food', (req, res) => {
  try {
    const foodName = req.query.name ? req.query.name.toLowerCase() : '';
    const foodData = req.app.locals.foodData;

    if (!foodName) {
      return res.status(400).json({ msg: 'Food name query is required' });
    }

    // Find the exact food item
    const foodItem = foodData.find(food => 
      food['Dish Name'] && food['Dish Name'].toLowerCase() === foodName
    );

    if (!foodItem) {
      return res.status(404).json({ msg: 'Food item not found' });
    }

    res.json(foodItem);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   POST /api/log
 * @desc    Save a new food log to the database
 * @access  Public
 * @body    { foodName, ..., mealType }
 */
router.post('/log', async (req, res) => {
  try {
    // Get the data from the request body
    const { 
      foodName, 
      servingSize, 
      quantity, 
      calories, 
      carbs, 
      fat, 
      fiber, 
      protein,
      mealType // <-- 1. GET THE NEW MEALTYPE
    } = req.body;

    // Create a new log document using our model
    const newLog = new FoodLog({
      foodName,
      servingSize,
      quantity,
      calories,
      carbs,
      fat,
      fiber,
      protein,
      mealType, // <-- 2. ADD IT TO THE NEW LOG OBJECT
      logDate: new Date() // Set the date to now
    });

    // Save the log to MongoDB
    const savedLog = await newLog.save();

    // Send the saved log back as confirmation
    res.status(201).json(savedLog);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   GET /api/log/date
 * @desc    Get all food logs for a specific date (e.g., "what I ate yesterday")
 * @access  Public
 * @query   ?date=[YYYY-MM-DD]
 */
router.get('/log/date', async (req, res) => {
  try {
    const dateString = req.query.date; // e.g., "2025-11-02"
    if (!dateString) {
      return res.status(400).json({ msg: 'Date query parameter is required' });
    }

    // Get the start of the specified day (00:00:00)
    const startDate = new Date(dateString);
    startDate.setUTCHours(0, 0, 0, 0); // Use UTC for consistency

    // Get the end of the specified day (23:59:59)
    const endDate = new Date(dateString);
    endDate.setUTCHours(23, 59, 59, 999); // Use UTC for consistency

    // Find all logs in the database where logDate is between the start and end
    const logs = await FoodLog.find({
      logDate: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ createdAt: 'asc' }); // Sort by when they were added

    res.json(logs);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   DELETE /api/log/:id
 * @desc    Delete a specific food log by its ID
 * @access  Public
 * @param   id (from URL)
 */
router.delete('/log/:id', async (req, res) => {
  try {
    // Find the log by its unique MongoDB _id
    const log = await FoodLog.findById(req.params.id);

    if (!log) {
      return res.status(404).json({ msg: 'Log not found' });
    }

    // Delete the log from the database
    await log.deleteOne();

    res.json({ msg: 'Log deleted successfully' });

  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Log not found' });
    }
    res.status(500).send('Server Error');
  }
});

export default router;