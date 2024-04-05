import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { pool } from './db';
import authRouter from './routes/authRouter';
import recipeRouter from './routes/recipeRouter';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Database connection successful:', res.rows[0]);
  }
});

// Middleware to parse JSON bodies
app.use(express.json());

// API routes
app.use('/api/auth', authRouter);
app.use('/api/recipes', recipeRouter);

// Serve static files from the React app
const buildPath = path.join(__dirname, '..', 'client', 'build');
app.use(express.static(buildPath));

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
