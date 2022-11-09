import express from 'express';
import UserController from './user.controller';
import UserValidator from './user.validator';

const router = express.Router();

router.post(
	'/register',
	[
		UserValidator.validateEmail,
		UserValidator.validatePassword,
		UserValidator.validateUsername,
	],
	UserController.register,
);

router.get('/verify', UserController.verify);

router.post(
	'/login',
	[UserValidator.validateEmail, UserValidator.validatePassword],
	UserController.login,
);

router.post(
	'/reset-password',
	UserValidator.validateEmail,
	UserController.resetPassword,
);

router.post(
	'/update-password',
	[UserValidator.validateResetToken, UserValidator.validatePassword],
	UserController.updatePassword,
);

export default router;
