import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db'; // Adjust the import path according to your project structure

const authRouter = express.Router();

// Registration endpoint
authRouter.post('/register', async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    
    // Hash password
    const saltRounds = 10; // Cost factor for hashing
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {
        // Insert the new user into the database
        const result = await pool.query(
            'INSERT INTO users (username, email, hashed_password) VALUES ($1, $2, $3) RETURNING id',
            [username, email, hashedPassword]
        );
        const userId = result.rows[0].id;

        // Respond with the new user's ID
        res.status(201).json({ userId });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error registering new user');
    }
});

// Login endpoint
authRouter.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // Retrieve user from the database
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (userResult.rows.length > 0) {
            const user = userResult.rows[0];

            // Check password
            const match = await bcrypt.compare(password, user.hashed_password);

            if (match) {
                // Generate a JWT
                const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

                res.json({ token });
            } else {
                res.status(401).send('Incorrect password');
            }
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error logging in user');
    }
});

export default authRouter;
