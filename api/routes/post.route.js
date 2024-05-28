import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create } from '../controllers/post.controller.js';

const postRoutes = express.Router();

postRoutes.post('/create', verifyToken, create);

export default postRoutes;