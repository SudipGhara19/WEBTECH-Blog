import express from 'express';
import { createComment, editComment, getPostComments, toggleLike } from '../controllers/comment.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const commentRoutes = express.Router();

commentRoutes.post('/create', verifyToken, createComment);
commentRoutes.get('/getPostComments/:postId', getPostComments);
commentRoutes.put('/toggleLike/:commentId', verifyToken, toggleLike);
commentRoutes.put('/editComment/:commentId', verifyToken, editComment);

export default commentRoutes;