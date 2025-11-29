import postRepository from '../repository/post.repository.js'

class PostService {

    async createPost(author, data) {
     return await postRepository.createPost({...data, author})
    }

    async  getPostById(id) {
        const post = await postRepository.findPostById(id);
        if (!post) {
            throw new Error(`Post with id ${id} not found`)
        }
        return post;
    }

    async addLikeToPost(postId) {
        const success = await postRepository.addLikeToPostByPostId(postId);
        if (!success) {
            throw new Error(`Post with id ${postId} not found`)
        }
        return success; // todo ?

    }

    async getPostsByAuthor(author) {
        const post = await postRepository.findPostsByAuthor(author);
        if (!post) {
            throw new Error(`Posts for user ${author} not found`)
        }
        return post;
    }

    async addComment(postId, commenter, comment) {

        const post = await postRepository.addComment(postId, commenter, comment);
        if (!post) {
            throw new Error(`Post with id ${postId} not found`)
        }
        return post;
    }

    async deletePostById(postId) {
        const post = await postRepository.deletePost(postId);
        if (!post) {
            throw new Error(`Post with id ${postId} not found`)
        }
        return post;
    }

    async getPostsByTags(tagsString) {
        const tags = tagsString.split(',');
        const posts = await postRepository.getPostsByTags(tags);
        if (!posts) {
            throw new Error(`Posts for tags ${tags} not found`)
        }
        return posts;
    }

    async getPostsByPeriod(dateFrom, dateTo) {
        const posts = await postRepository.getPostsByPeriod(dateFrom, dateTo);
        if (!posts) {
            throw new Error(`Posts for period ${dateFrom} - ${dateTo} not found`)
        }
        return posts;
    }

    async updatePost(postId, data) {
        const post = await postRepository.updatePost(postId, data);
        if (!post) {
            throw new Error(`Post with id ${postId} not found`)
        }
        return post;
    }
}

export default new PostService()