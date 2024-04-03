"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRouter_1 = __importDefault(require("./routes/authRouter"));
const recipeRouter_1 = __importDefault(require("./routes/recipeRouter"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000; // Convert PORT to a number
app.use(express_1.default.json());
app.use('/auth', authRouter_1.default);
app.use('/recipes', recipeRouter_1.default);
app.get("/", (req, res) => res.send("Hello World from the server"));
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
