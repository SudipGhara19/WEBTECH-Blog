import express from 'express';
import { test, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from '../utils/verifyUser.js';


const userRoutes = express.Router();

userRoutes.get('/test', test);
userRoutes.put('/update/:userId', verifyToken, updateUser);

export default userRoutes;