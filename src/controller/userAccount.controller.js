import userAccountService from "../services/userAccount.service.js";

class UserAccountController {

    async register(req, res, next) {
        try {
            const newUser = await userAccountService.register(req.body);
            return res.status(201).json(newUser);

        } catch (error) {
            return next(error);
        }
    }

    async getUser(req, res, next) {
        try {
            const user = await userAccountService.getUser(req.params.login);
            return res.json(user);
        } catch (error) {
            return next(error);
        }
    }

    async updateUser(req, res, next) {
        try {
            const user = await userAccountService.updateUser(req.params.login, req.body);
            return res.json(user);
        } catch (error) {
            return next(error);
        }
    }

    async addRole(req, res, next) {
        try {
            const user = await userAccountService.changeRoles(req.params.login, req.params.role, true);
            return res.json(user);
        } catch (error) {
            return next(error);
        }
    }

    async removeRole(req, res, next) {
        try {
            const user = await userAccountService.changeRoles(req.params.login, req.params.role, false);
            return res.json(user);
        } catch (error) {
            return next(error);
        }
    }

    async changePassword(req, res, next) {
        try {
            await userAccountService.changePassword(req.body); // Here we also can get auth data from headers
            return res.status(204).end();
        } catch (error) {
            return next(error);
        }
    }

    async deleteUser(req, res, next) {
        try {
            const user = await userAccountService.removeUser(req.params.login);
            return res.json(user);
        } catch (error) {
            return next(error);
        }
    }

}

export default new UserAccountController();