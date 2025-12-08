import User from "../model/user.model.js";
import {ADMIN, MODERATOR, USER} from "./constants.js";

export async function initAdmin() {
    let admin = await User.findById('admin');
    if (!admin) {
        admin = new User({
            login: 'admin',
            password: 'admin',
            firstName: 'Admin',
            lastName: 'Adminov',
            roles: [USER, MODERATOR, ADMIN]
        })
        await admin.save();
    }
}