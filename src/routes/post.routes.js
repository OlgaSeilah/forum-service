import express from 'express';
import postController from "../controller/post.controller.js";
import validate from "../middlewares/validation.middleware.js";
import checkRolesMiddleware from "../middlewares/checkRoles.middleware.js";
import {MODERATOR} from "../config/constants.js";
import checkIfResourceOwnerMiddleware from "../middlewares/checkIfResourceOwner.middleware.js";
import checkAllPermissionsMiddleware from "../middlewares/checkAllPermissions.middleware.js";

const router = express.Router();

/** POST requests */
router.post('/post/:author',
    checkIfResourceOwnerMiddleware,
    validate('createPost'), postController.createPost);

/** GET requests */
router.get('/post/:id', postController.getPostById);

router.get('/posts/author/:author', postController.getPostsByAuthor);
router.get('/posts/tags', postController.getPostsByTags)
router.get('/posts/period', validate('dateFormat', 'query'), postController.getPostsByPeriod)

/** PATCH requests */
router.patch('/post/:id/like', postController.addLikeToPost);
router.patch('/post/:id/comment/:commenter',
    checkIfResourceOwnerMiddleware,
    validate('addComment'), postController.addComment);

router.patch('/post/:id',
    checkIfResourceOwnerMiddleware,
    validate('updatePost'),
    postController.updatePost)

/** DELETE requests */
router.delete('/post/:id',
    checkAllPermissionsMiddleware(
        checkRolesMiddleware(MODERATOR),
        checkIfResourceOwnerMiddleware,
    ),
    postController.deletePostById);

export default router;