import Post from '../model/post.model.js';

class PostRepository {

    async createPost(postData) {
        const post = new Post(postData);
        return post.save();
    }

    async findPostById(id) {
        return Post.findById(id);
    }

    async addLikeToPostByPostId(postId) {
        return Post.findByIdAndUpdate(postId, {
            $inc: {
                likes: 1
            }
        }, {}, {});
    } // todo check this logic


    async findPostsByAuthor(authorName) {
        return Post.find(
            {author: authorName}
        )
    }

    async addComment(postId, commenter, comment) {
        return Post.findByIdAndUpdate(
            postId,
            {
                $push: {
                    comments: {
                        user: commenter,
                        message: comment,
                    }
                }
            },
            {new: true}
        )
    }

    async updatePost(postId, data) {
        const updatedPost = {};

        if (data.tags) {
            updatedPost.$addToSet = {tags: {$each: data.tags}};
        }
        if (data.title || data.content) {
            updatedPost.$set = {
                title: data.title,
                content: data.content
            };
        }

        return Post.findByIdAndUpdate(
            postId,
            updatedPost,
            {new: true}
        )
    }

    async getPostsByTags(tags) {
        // return Post.find(
        //     {
        //         tags: {
        //             $in: tags,
        //         }
        //     }
        // ).collation({locale: 'en', strength: 2})

        const regexRule = tags.map(tag => ({
            tags: new RegExp(`^${tag}$`, 'i')
        }));
        return Post.find({
            $or: regexRule
        })
    }

    async getPostsByPeriod(dateFrom, dateTo) {
        return Post.find(
            {
                dateCreated: {
                    $gte: dateFrom,
                    $lte: dateTo
                }
            }
        )
    }

    async deletePost(id) {
        return Post.findByIdAndDelete(id);
    }
}

export default new PostRepository();