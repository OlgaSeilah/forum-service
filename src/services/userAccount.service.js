import userAccountRepository  from "../repository/userAccount.repository.js";

class UserAccountService {

    async register(userData) {
        return await userAccountRepository.createUser(userData);

    }

    async getUser(login) {
        // TODO: return user profile
    }

    async removeUser(login) {
        // TODO: remove user and return user profile
    }

    async updateUser(login, user) {
        // TODO: update user profile and return user profile
    }

    async changeRoles(login, role, isAddRole) {
        // TODO: add or remove role and return user profile
    }

    async changePassword(login, newPassword) {
        // TODO: DO NOT IMPLEMENT change password
    }


}

export default new UserAccountService();