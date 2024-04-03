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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const authRouter = express_1.default.Router();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("Missing environment variable JWT_SECRET");
}
// Registration endpoint
authRouter.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    const hashedPassword = yield bcrypt_1.default.hash(password, 10); // Ensure bcrypt is correctly used for hashing
    try {
        // Check if user already exists
        const existingUser = yield db_1.pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(409).send('User already exists');
        }
        // Insert new user
        const newUser = yield db_1.pool.query('INSERT INTO users (username, email, hashed_password) VALUES ($1, $2, $3) RETURNING *', [username, email, hashedPassword]);
        res.status(201).json(newUser.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error registering new user');
    }
}));
// Login endpoint
authRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Attempt to find the user by email
        const userResult = yield db_1.pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(404).send('User not found');
        }
        const user = userResult.rows[0];
        // Check if the provided password matches the stored hashed password
        const match = yield bcrypt_1.default.compare(password, user.hashed_password);
        if (!match) {
            return res.status(401).send('Incorrect password');
        }
        // User is authenticated, generate a JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, // Payload
        process.env.JWT_SECRET, // Asserting JWT_SECRET is not undefined
        { expiresIn: '1h' } // Token expiry
        );
        // Send the token to the client
        res.json({ token });
    }
    catch (err) {
        console.error('Error logging in user:', err);
        res.status(500).send('Error logging in user');
    }
}));
exports.default = authRouter;
