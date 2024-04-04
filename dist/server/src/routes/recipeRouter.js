var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import { pool } from '../db';
import authenticateToken from '../middleware/authenticateToken';
const recipeRouter = express.Router();
recipeRouter.post('/', authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, serving_size, time_required, ingredients, directions } = req.body;
    try {
        const newRecipe = yield pool.query('INSERT INTO recipes (name, serving_size, time_required, ingredients, directions) VALUES ($1, $2, $3, $4, $5) RETURNING *', [name, serving_size, time_required, JSON.stringify(ingredients), JSON.stringify(directions)]);
        res.status(201).json(newRecipe.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}));
recipeRouter.get('/', authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allRecipes = yield pool.query('SELECT * FROM recipes');
        res.json(allRecipes.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}));
recipeRouter.delete('/:id', authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deleteRecipe = yield pool.query('DELETE FROM recipes WHERE id = $1 RETURNING *', [id]);
        if (deleteRecipe.rows.length === 0) {
            return res.status(404).send('Recipe not found');
        }
        res.status(200).send('Recipe deleted');
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}));
recipeRouter.delete('/:id', authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deleteRecipe = yield pool.query('DELETE FROM recipes WHERE id = $1 RETURNING *', [id]);
        if (deleteRecipe.rows.length === 0) {
            return res.status(404).send('Recipe not found');
        }
        res.status(200).send('Recipe deleted');
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}));
export default recipeRouter;
//# sourceMappingURL=recipeRouter.js.map