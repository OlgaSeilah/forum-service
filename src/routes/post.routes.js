import express from 'express';
import postController from "../controller/post.controller.js";
import validate from "../middlewares/validation.middleware.js";

const router = express.Router();

router.post('/post/:author', validate('createPost'), postController.createPost);
router.get('/post/:id', validate('getPostById'), postController.getPostById);

export default router;