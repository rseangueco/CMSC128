/*
accept username and encrypted password in req.body
if they match, create json web token and return token with status 200
else return error with status 401
*/

import express from 'express';
import { User } from '../../models/user.js'; //User is a placeholder for model to be returned; user.js is a placeholder for actual model js file
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

let router = express.Router();
let secretKey = 'your_secret_key';

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(200).json({ message: 'User registered successfully' });
    } catch (e) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (e) {
        res.status(500).json({ error: 'Login failed' });
    }
});

export { router };
