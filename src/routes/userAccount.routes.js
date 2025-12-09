import express from 'express';
import userAccountController from "../controller/userAccount.controller.js";
import validate from "../middlewares/validation.middleware.js";
import checkRoleMiddleware from "../middlewares/checkRoles.middleware.js";
import {ADMIN} from "../config/constants.js";
import checkAllPermissionsMiddleware from "../middlewares/checkAllPermissions.middleware.js";
import checkIfResourceOwnerMiddleware from "../middlewares/checkIfResourceOwner.middleware.js";

const router = express.Router();

/** GET requests */
router.get('/user/:login', userAccountController.getUser);

/** POST requests */
router.post('/login', userAccountController.login);

router.post('/register',
    validate('registerUser'),
    userAccountController.register);

/** PATCH requests */
router.patch('/user/:login',
    checkIfResourceOwnerMiddleware,
    validate('updateUser'),
    userAccountController.updateUser);

router.patch('/user/:login/role/:role',
    checkRoleMiddleware(ADMIN),
    validate('roleManagement', 'params'),
    userAccountController.addRole);

router.patch('/password',
    checkIfResourceOwnerMiddleware,
    validate('changePassword'),
    userAccountController.changePassword);

/** DELETE requests */
router.delete('/user/:login/role/:role',
    checkRoleMiddleware(ADMIN),
    validate('roleManagement', 'params'),
    userAccountController.removeRole);

router.delete('/user/:login',
    checkAllPermissionsMiddleware(
        checkIfResourceOwnerMiddleware,
        checkRoleMiddleware(ADMIN),
    ),
    userAccountController.deleteUser);

export default router;