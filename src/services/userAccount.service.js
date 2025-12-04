import userAccountRepository  from "../repository/userAccount.repository.js";

class UserAccountService {

    async register(userData) {
        return await userAccountRepository.createUser(userData);
    }

    async login() {
        // TODO: DO NOT IMPLEMENT change password
    }

    async getUser(login) {
        const user =  await userAccountRepository.getUserByLogin(login);
        if (!user) {
            throw new Error(`User with login ${login} not found`)
        }
        return user;
    }

    async removeUser(login) {
        const deletedUser = await userAccountRepository.removeUserByLogin(login);
        if (!deletedUser) {
            throw new Error(`User with login ${login} not found`)
        }
        return deletedUser;

    }

    async updateUser(login, userData) {
        const updatedUser = await userAccountRepository.updateUserNameOrSurname(login, userData);
        if (!updatedUser) {
            throw new Error(`User with login ${login} not found`)
        }
        return updatedUser;
    }

    async changeRoles(login, role, isAddRole) {
        let updatedUser={}
        if (isAddRole) {
            updatedUser = await userAccountRepository.addRoleToUser(login, role.toUpperCase());
        } else {
            updatedUser = await userAccountRepository.deleteRoleFromUser(login, role.toUpperCase());
        }
        if(!updatedUser) {
            throw new Error(`User with login ${login} not found`)
        }
        return updatedUser;
    }

    async changePassword(login, newPassword) {
        return await userAccountRepository.changePassword(login, newPassword);
        // I'm not sure about returning 404 here (because of checking user existence from header)
    }


}

export default new UserAccountService();