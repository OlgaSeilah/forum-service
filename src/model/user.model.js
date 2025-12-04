import mongoose, {Types} from 'mongoose';

const userSchema = new mongoose.Schema({
        _id: {
            type: String,
            required: true,
            alias: 'login'
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
            default: ['USER']
        }
    },
    {
        versionKey: false,
        toJSON: {
            transform: function (doc, ret) {
                ret.login = ret._id;
                delete ret.password;
                delete ret._id

                const {login, ...rest} = ret;
                return {
                    login,
                    ...rest
                }
            }
        }
    }
);

export default mongoose.model('User', userSchema, 'users');