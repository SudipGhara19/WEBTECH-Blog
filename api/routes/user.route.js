import express from 'express';
import { deleteUser, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from '../utils/verifyUser.js';


const userRoutes = express.Router();

userRoutes.put('/update/:userId', verifyToken, updateUser);
userRoutes.delete('/delete/:userId', verifyToken, deleteUser);

export default userRoutes;