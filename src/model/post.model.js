import mongoose from "mongoose";
import config from "../config/config.js";

const postSchema = new mongoose.Schema({
    id: {type: String, required: true},
    title: {type: String, required: true},
    content: {type: String, required: true},
    author: {type: String, required: false},
    dateCreated: {type: Date, default: Date.now},
    tags: [String],
    likes: {type: Number, default: 0},
    comments: []
    }
)

const Post = mongoose.model('Post', postSchema, config.mongoDb.db.collectionName);
export default Post;