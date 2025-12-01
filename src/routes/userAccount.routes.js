import express from 'express';
import userAccountController from "../controller/userAccount.controller.js";

const router = express.Router();

router.get('/user/:login', userAccountController.getUser);
// router.post('/login') log in //todo after lesson
router.post('/register', userAccountController.register); // todo add validation
router.patch('/user/:login', userAccountController.updateUser); // todo add validation
router.patch('/user/:login/role/:role', userAccountController.addRole); // todo add validation
// router.patch(''); change password todo after lesson
router.delete('/user/:login/role/:role', userAccountController.removeRole); // todo add validation
router.delete('/user/:login', userAccountController.deleteUser);

export default router;