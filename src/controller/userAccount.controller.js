import userAccountService from "../services/userAccount.service.js";

class UserAccountController {

    async register(req, res, next) {
        try {
            //todo add to middleware validation of email and password
            const newUser = await userAccountService.register(req.body);
            return res.json(newUser);

        } catch (error) {
            return next(error);
        }
    }

}

export default new UserAccountController();