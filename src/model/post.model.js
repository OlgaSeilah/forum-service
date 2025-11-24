import mongoose from "mongoose";
import config from "../config/config.js";

const postSchema = new mongoose.Schema({
        id: {type: String, required: false},
    title: {type: String, required: true},
    content: {type: String, required: true},
    author: {type: String, required: false},
    dateCreated: {type: Date, default: Date.now},
    tags: [String],
    likes: {type: Number, default: 0},
    comments: []
    },
    {
        versionKey: false,
        toJSON: {
            transform: function (doc, ret) {
                const responseBody = {};
                responseBody.id = ret._id;
                delete ret._id;
                responseBody.dateCreated = ret.dateCreated.toISOString().slice(0, 19);
                delete ret.dateCreated;

                for (const key in ret) {
                    responseBody[key] = ret[key];
                }

                const rowsOrder = ['id', 'title', 'content', 'author', 'dateCreated', 'tags', 'likes', 'comments'];
                const correctOrder = {};
                rowsOrder.forEach(key => {
                    correctOrder[key] = responseBody[key]
                })

                return correctOrder;
            }
        }
    },
)

const Post = mongoose.model('Post', postSchema, config.mongoDb.collectionNames.posts);
export default Post;