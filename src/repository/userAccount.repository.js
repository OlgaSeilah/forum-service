import User from '../model/user.model.js';

class UserAccountRepository {

    async createUser(userData) {
        const user = new User(userData);
        try {
            return user.save();
        } catch (error) {
            return error;
        }
    }

    async getUserByLogin(login) {
        return User.findOne({
            login: login
        })
    }

    async updateUserNameOrSurname(login, dataForUpdate) {
        const updatedUserAccount = {};
        if (dataForUpdate.firstName) {
            updatedUserAccount.firstName = dataForUpdate.firstName;
        }
        if(dataForUpdate.lastName) {
            updatedUserAccount.lastName = dataForUpdate.lastName;
        }

        return User.findOneAndUpdate(
            {login},
            updatedUserAccount,
            {new: true}
        )
    }

    async addRoleToUser(login, role) {
        return User.findOneAndUpdate(
            {login},
            {$addToSet: {roles: role}},
            {new: true}
        )
    }

    async deleteRoleFromUser(login, role) {
        return User.findOneAndUpdate(
            {login},
            {$pull: {roles: role}},
            {new:true}
        )
    }

    async removeUserByLogin(login) {
        return User.findOneAndDelete({
            login: login
        }); // todo what to send if not found? - 404
    }


}

export default new UserAccountRepository();