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
        //todo add like to post
        throw new Error('Not implemented')

    }

    async getPostsByAuthor(author) {
        //todo add get post by author
        throw new Error('Not implemented')
    }

    async addComment(postId, commenter, comment) {
        //todo add comment to post
        throw new Error('Not implemented')
    }

    async deletePostById(postId) {
        const post = await postRepository.deletePost(postId);
        if (!post) {
            throw new Error(`Post with id ${postId} not found`)
        }
        return post;
    }

    async getPostsByTags(tagsString) {
        //todo add get post by tags
        throw new Error('Not implemented')
    }

    async getPostsByPeriod(dateFrom, dateTo) {
        //todo add get post by period
        // dateFormat = "YYYY-MM-DD"
        throw new Error('Not implemented')
    }

    async updatePost(postId, data) {

    }
}

export default new PostService()