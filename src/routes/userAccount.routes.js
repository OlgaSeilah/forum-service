import express from 'express';
import userAccountController from "../controller/userAccount.controller.js";
import validate from "../middlewares/validation.middleware.js";

const router = express.Router();

router.get('/user/:login', userAccountController.getUser);
// router.post('/login') log in //todo after lesson
router.post('/register', validate('registerUser'), userAccountController.register);
router.patch('/user/:login', validate('updateUser'), userAccountController.updateUser);
router.patch('/user/:login/role/:role', validate('roleManagement', 'params'), userAccountController.addRole);
// router.patch(''); change password todo after lesson
router.delete('/user/:login/role/:role', validate('roleManagement', 'params'), userAccountController.removeRole);
router.delete('/user/:login', userAccountController.deleteUser);

export default router;