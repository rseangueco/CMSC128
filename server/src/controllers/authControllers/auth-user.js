import express from 'express';
import { User, Admin, Alumni } from '../../models/User.js';
import { alumniController } from '../modelControllers/alumniController.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config({path: "../server/.env"})

let secretKey = process.env.SECRET_KEY;

export const register = async (req, res) => {
    try {
        // check if existing email
        const existingEmail = await User.findOne({ email: req.body.email });
        if (existingEmail) {
            return res.status(409).json({ error: 'Email already in use' });
        }

        // check user type      *can probably remove when input middleware is made
        if (!["Admin", "Alumni"].includes(req.body.user_type)) {
            return res.status(400).json({ error: 'Invalid User Type' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;

        if (req.body.user_type === "Admin") {
            await alumniController.create(req, res);
        } else {
            await alumniController.create(req, res);
        }

        res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
};

export const login = async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});

        if (!user) {
            console.log("Not found")
            return res.status(401).json({ error: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        console.log(secretKey);

        const token = jwt.sign(
            { userId: user._id, user_type: user.user_type },
            secretKey,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token });
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Login failed' });
    }
};
