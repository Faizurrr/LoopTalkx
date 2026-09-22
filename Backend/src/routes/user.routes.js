import express from 'express';
import { getAllUsers , getMe , getRecommendedFriends } from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const userRoutes = express.Router();

userRoutes.use(protect); // All user routes are protected

userRoutes.get('/me', getMe); // for getting the current logged-in user's profile..
userRoutes.get('/allusers', getAllUsers);
userRoutes.get('/Recommendedfriends', getRecommendedFriends); // for getting the current logged-in user's profile..


export default userRoutes;
