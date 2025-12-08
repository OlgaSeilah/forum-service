import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import {USER} from "../config/constants.js";

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
            default: [USER]
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

userSchema.pre('save', async function () {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
    }
})

userSchema.methods.comparePassword = async function (plainTextPassword) {
    return await bcrypt.compare(plainTextPassword, this.password);
}

export default mongoose.model('User', userSchema, 'users');