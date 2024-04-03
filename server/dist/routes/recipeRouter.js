"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const authenticateToken_1 = __importDefault(require("../middleware/authenticateToken"));
const recipeRouter = express_1.default.Router();
recipeRouter.post('/', authenticateToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, serving_size, time_required, ingredients, directions } = req.body;
    try {
        const newRecipe = yield db_1.pool.query('INSERT INTO recipes (name, serving_size, time_required, ingredients, directions) VALUES ($1, $2, $3, $4, $5) RETURNING *', [name, serving_size, time_required, JSON.stringify(ingredients), JSON.stringify(directions)]);
        res.status(201).json(newRecipe.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}));
recipeRouter.get('/', authenticateToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allRecipes = yield db_1.pool.query('SELECT * FROM recipes');
        res.json(allRecipes.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}));
recipeRouter.delete('/:id', authenticateToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deleteRecipe = yield db_1.pool.query('DELETE FROM recipes WHERE id = $1 RETURNING *', [id]);
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
recipeRouter.delete('/:id', authenticateToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deleteRecipe = yield db_1.pool.query('DELETE FROM recipes WHERE id = $1 RETURNING *', [id]);
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
exports.default = recipeRouter;
