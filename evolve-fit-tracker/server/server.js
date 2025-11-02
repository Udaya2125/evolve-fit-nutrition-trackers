import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';

// Import your API routes (we will create this file next)
import apiRoutes from './routes/api.routes.js';

// --- Basic Setup ---

// Load environment variables from .env file
dotenv.config();

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 5001;

// ES module equivalent of __dirname for file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Middleware ---

// Enable Cross-Origin Resource Sharing (CORS)
// This lets your React frontend (on a different port) talk to this server
app.use(cors());

// Tell Express to understand JSON data in request bodies
app.use(express.json());

// --- In-Memory CSV Data Loading ---

// This array will hold all the food data from your CSV
const foodData = [];

const csvFilePath = path.join(__dirname, 'data', 'Indian_Food_Nutrition_Processed.csv');

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    // This function runs for every row in the CSV
    foodData.push(row);
  })
  .on('end', () => {
    console.log('CSV data loaded successfully into memory.');
  });

// Make the foodData array available to all your API routes
// We do this by attaching it to the 'app.locals' object
app.locals.foodData = foodData;

// --- API Routes ---

// Tell Express to use the routes defined in api.routes.js
// All routes in that file will be prefixed with /api
app.use('/api', apiRoutes);

// --- Database Connection & Server Start ---

console.log('Connecting to MongoDB...');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');

    // Only start the server *after* the database is connected
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });