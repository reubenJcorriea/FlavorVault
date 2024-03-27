import express from 'express';
import { pool } from '../db';
import  authenticateToken  from '../middleware/authenticateToken';

const recipeRouter = express.Router();

recipeRouter.post('/', authenticateToken, async (req, res) => {
    const { name, serving_size, time_required, ingredients, directions } = req.body;
    try {
        const newRecipe = await pool.query(
            'INSERT INTO recipes (name, serving_size, time_required, ingredients, directions) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, serving_size, time_required, JSON.stringify(ingredients), JSON.stringify(directions)]
        );
        res.status(201).json(newRecipe.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

recipeRouter.get('/', authenticateToken, async (req, res) => {
    try {
        const allRecipes = await pool.query('SELECT * FROM recipes');
        res.json(allRecipes.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

recipeRouter.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const deleteRecipe = await pool.query(
            'DELETE FROM recipes WHERE id = $1 RETURNING *',
            [id]
        );
        if (deleteRecipe.rows.length === 0) {
            return res.status(404).send('Recipe not found');
        }
        res.status(200).send('Recipe deleted');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


recipeRouter.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const deleteRecipe = await pool.query(
            'DELETE FROM recipes WHERE id = $1 RETURNING *',
            [id]
        );
        if (deleteRecipe.rows.length === 0) {
            return res.status(404).send('Recipe not found');
        }
        res.status(200).send('Recipe deleted');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


export default recipeRouter;