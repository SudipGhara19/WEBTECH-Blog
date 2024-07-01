import express from 'express';
import { createComment, getPostComments, toggleLike } from '../controllers/comment.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const commentRoutes = express.Router();

commentRoutes.post('/create', verifyToken, createComment);
commentRoutes.get('/getPostComments/:postId', getPostComments);
commentRoutes.put('/toggleLike/:commentId', verifyToken, toggleLike);

export default commentRoutes;