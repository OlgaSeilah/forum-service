import User from '../model/user.model.js';

class UserAccountRepository {

    async createUser(userData) {
        const user = new User(userData);
            return user.save();
    }

    async getUserByLogin(login) {
        return User.findById(login);
    }

    async updateUserNameOrSurname(login, dataForUpdate) {
        return User.findByIdAndUpdate(login, dataForUpdate, {new: true})
    }

    async addRoleToUser(login, role) {
        return User.findByIdAndUpdate(
            login,
            {$addToSet: {roles: role}},
            {new: true}
        )
    }

    async deleteRoleFromUser(login, role) {
        return User.findByIdAndUpdate(
            login,
            {$pull: {roles: role}},
            {new:true}
        )
    }

    async removeUserByLogin(login) {
        return User.findByIdAndDelete(login);
    }


}

export default new UserAccountRepository();