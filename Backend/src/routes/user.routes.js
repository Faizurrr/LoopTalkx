import express from 'express';
import { getAllUsers, getUserById, updateProfile } from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect); // All user routes are protected

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/profile', updateProfile);

export default router;
