import express from 'express';
import dotenv from 'dotenv';
import { pool } from './db'; 
import authRouter from './routes/authRouter';
import recipeRouter from './routes/recipeRouter';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Database connection successful:', res.rows[0]);
  }
});

app.use(express.json());
app.use('/auth', authRouter);
app.use('/recipes', recipeRouter);

app.get("/", (req, res) => res.send("Hello World from the server"));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
