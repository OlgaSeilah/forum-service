import express from 'express';
import postController from "../controller/post.controller.js";
import validate from "../middlewares/validation.middleware.js";

const router = express.Router();

router.post('/post/:author', validate('createPost'), postController.createPost);
router.get('/post/:id', postController.getPostById);
router.get('/posts/author/:author', postController.getPostsByAuthor);
router.get('/posts/tags', postController.getPostsByTags)
router.get('/posts/period', postController.getPostsByPeriod)
router.patch('/post/:id/like', postController.addLikeToPost);
router.patch('/post/:id/comment/:commenter', validate('addComment'), postController.addComment);
router.patch('/post/:id', validate('updatePost'), postController.updatePost)
router.delete('/post/:id', postController.deletePostById);

export default router;