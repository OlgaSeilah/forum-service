import Post from "../model/posts/post.model.js";

/** Check if the user is an owner of the post */

const checkIfResourceOwnerMiddleware = async (req, res, next) => {
    const login = req.principal.username;
    let author = req.params.author || req.params.login || req.params.commenter;
    if (!author) {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({message: 'Post not found'});
        }
        author = post.author;
    }

    if (login !== author) {
        return res.status(403).json({message: 'Forbidden for not indicated owner'})
    }

    return next();
}

export default checkIfResourceOwnerMiddleware;