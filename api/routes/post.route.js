import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, deletePost, getPosts } from '../controllers/post.controller.js';

const postRoutes = express.Router();

postRoutes.post('/create', verifyToken, create);
postRoutes.get('/getposts', getPosts);
postRoutes.delete('/deletepost/:userId/:postId', verifyToken, deletePost);

export default postRoutes;