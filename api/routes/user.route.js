import express from 'express';
import { deleteUser, getUser, getUsers, signOut, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from '../utils/verifyUser.js';


const userRoutes = express.Router();

userRoutes.put('/update/:userId', verifyToken, updateUser);
userRoutes.delete('/delete/:userId', verifyToken, deleteUser);
userRoutes.post('/signout', signOut);
userRoutes.get('/getusers', verifyToken, getUsers);
userRoutes.get('/getUser/:userId', getUser);

export default userRoutes;