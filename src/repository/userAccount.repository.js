import User from '../model/user.model.js';

class UserAccountRepository {

    async createUser(userData) {
        const user = new User(userData);
        return user.save();
    }


}

export default new UserAccountRepository();