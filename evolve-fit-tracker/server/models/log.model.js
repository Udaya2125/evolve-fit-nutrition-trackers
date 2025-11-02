import mongoose from 'mongoose';

// A Schema defines the structure of a document in MongoDB
const LogSchema = new mongoose.Schema({
  foodName: {
    type: String,
    required: true,
    trim: true // Removes any extra whitespace
  },
  servingSize: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0 // Quantity cannot be negative
  },
  calories: {
    type: Number,
    required: true,
    min: 0
  },
  carbs: {
    type: Number,
    required: true,
    min: 0
  },
  fat: {
    type: Number,
    required: true,
    min: 0
  },
  fiber: {
    type: Number,
    required: true,
    min: 0
  },
  protein: {
    type: Number,
    required: true,
    min: 0
  },
  
  // --- THIS IS THE NEW FIELD ---
  mealType: {
    type: String,
    required: true,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snacks'] // Only allows these values
  },
  // -----------------------------

  logDate: {
    type: Date,
    required: true,
    default: Date.now // Automatically sets the log date to the current time
  }
}, {
  // timestamps: true will automatically add 'createdAt' and 'updatedAt' fields
  timestamps: true 
});

// A Model is the class compiled from the Schema.
// This is what we will use to find, create, update, and delete documents.
const FoodLog = mongoose.model('FoodLog', LogSchema);

export default FoodLog;