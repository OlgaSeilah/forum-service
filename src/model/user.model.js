import mongoose, {Types} from 'mongoose';

const userSchema = new mongoose.Schema({
        // _id: {
        //     type: String,
        //     default: () => new Types.ObjectId().toHexString()
        // },
        login: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        roles: {
            type: [String],
        }
    },
    {
        versionKey: false,
        toJSON: {
            transform: function (doc, ret) {
                delete ret.password;
                delete ret._id
                return ret;
                // const {_id, ...rest} = ret;
                // return {
                //     id: _id,
                //     ...rest
                // }
            }
        }
    }
);

export default mongoose.model('User', userSchema, 'users');