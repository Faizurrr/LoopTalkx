import express from 'express';
import { createprofile } from '../controllers/profile.controller.js';
import {protect} from '../middlewares/auth.middleware.js';
 
const profileRoutes = express.Router();
 
 profileRoutes.post('/CompleteProfile', protect, createprofile);
 export default profileRoutes;