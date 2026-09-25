import express from 'express';
import { register } from '../controllers/auth.controller.js';
import { login } from '../controllers/auth.controller.js';



const authRoutes = express.Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login);


export default authRoutes;
