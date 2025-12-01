import express from 'express';
import userAccountController from "../controller/userAccount.controller.js";

const router = express.Router();

router.post('/register', userAccountController.register);

export default router;