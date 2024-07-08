import express from 'express';
import { createComment, deleteComment, editComment, getComments, getPostComments, toggleLike } from '../controllers/comment.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const commentRoutes = express.Router();

commentRoutes.post('/create', verifyToken, createComment);
commentRoutes.get('/getPostComments/:postId', getPostComments);
commentRoutes.put('/toggleLike/:commentId', verifyToken, toggleLike);
commentRoutes.put('/editComment/:commentId', verifyToken, editComment);
commentRoutes.delete('/deleteComment/:commentId', verifyToken, deleteComment);
commentRoutes.get('/getComments', verifyToken, getComments);

export default commentRoutes;