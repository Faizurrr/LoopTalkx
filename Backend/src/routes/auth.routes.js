import express from "express";
import { register, login } from '../controllers/auth.controller.js';
import { getMe } from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const authRoutes = express.Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.get('/me', protect, getMe);

export default authRoutes;
