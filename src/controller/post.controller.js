import postService from '../services/post.service.js'

class PostController {

    async createPost(req, res, next) {
        try {
            const post = await postService.createPost(req.params.author, req.body);
            return res.status(201).json(post);
        } catch (error) {
            return next(error);
        }
    }

    async getPostById(req, res, next) {
        try {
            const post = await postService.getPostById(req.params.id);
            return res.json(post);
        } catch (error) {
            return next(error);
        }
    }

    async addLikeToPost(req, res, next) {
        try {
            await postService.addLikeToPost(req.params.id);
            return res.status(204).end()
        } catch (error) {
            return next(error);
        }
    }

    async getPostsByAuthor(req, res, next) {
        try {
            const posts = await postService.getPostsByAuthor(req.params.author);
            return res.json(posts);
        } catch (error) {
            return next(error);
        }
    }

    async addComment(req, res, next) {
        try {
            const postWithComment =
                await postService.addComment(req.params.id, req.params.commenter, req.body.message);

            return res.json(postWithComment);
        } catch (error) {
            return next(error);
        }
    }

    async getPostsByTags(req, res, next) {
        try {
            const posts = await postService.getPostsByTags(req.query.values.toLowerCase()); // todo or split here?
            return res.json(posts);
        } catch (error) {
            return next(error);
        }
    }

    async getPostsByPeriod(req, res, next) {
        try {
            const posts = await postService.getPostsByPeriod(req.query.dateFrom, req.query.dateTo);
            return res.json(posts);
        } catch (error) {
            return next(error);
        }
    }

    async updatePost(req, res, next) {
        try {
            const post = await postService.updatePost(req.params.id, req.body);
            return res.json(post);
        } catch (error) {
            return next(error);
        }
    }

    async deletePostById(req, res, next) {
        try {
            const post = await postService.deletePostById(req.params.id);
            return res.json(post);
        } catch (error) {
            return next(error);
        }
    }

}

export default new PostController();