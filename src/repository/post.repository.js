import Post from "../model/post.model.js";

class PostRepository {
    createPost(post) {
        return Post.create(post);
    }

    getPostById(id) {
        return Post.findById(id);
    }

}

export default new PostRepository();