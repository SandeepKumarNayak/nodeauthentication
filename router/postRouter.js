
import express from 'express';
import { createPost, deletePost, getPostById, getPosts, getPostsByUserId, updatePost } from '../controllers/postController.js';
import { identification } from '../middleware/identification.js';
const router = express.Router();

router.get('/',getPosts);
router.post('/createpost',identification, createPost);
router.delete('/deletepost',identification, deletePost);
router.patch('/updatepost',identification, updatePost);
router.get('/getpostbyid', getPostById);
router.get('/getpostsbyuserid',identification, getPostsByUserId);

export default router;