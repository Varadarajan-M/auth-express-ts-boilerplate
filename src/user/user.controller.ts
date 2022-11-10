import { Request, Response } from 'express';
import UserService from './user.service';
import { LoggedInRequest } from '../types/User';
import Utils from '../util';

class UserController {
	static async register(req: Request, res: Response) {
		const { email, password, username } = req.body;
		const response = await UserService.register({
			email,
			password,
			username,
		});
		if (response.ok) {
			res.status(201).json(response);
		} else {
			res.status(400).json(response);
		}
	}

	static async verify(req: Request, res: Response) {
		const response = await UserService.verify(req.query?.u as string);

		const successRedirectUrl = Utils.isProduction()
			? process.env.USER_VERIFICATION_SUCCESS_REDIRECT_CLIENT_URL_PROD
			: process.env.USER_VERIFICATION_SUCCESS_REDIRECT_CLIENT_URL_DEV;

		const failureRedirectUrl = Utils.isProduction()
			? process.env.USER_VERIFICATION_SUCCESS_REDIRECT_CLIENT_URL_PROD
			: process.env.USER_VERIFICATION_SUCCESS_REDIRECT_CLIENT_URL_DEV;

		if (response.ok) {
			res.redirect(successRedirectUrl);
		} else {
			res.redirect(failureRedirectUrl);
		}
	}

	static async login(req: Request, res: Response) {
		const { email, password } = req.body;
		const response = await UserService.login({ email, password });
		if (response.ok) {
			res.status(200).json(response);
		} else {
			res.status(400).json(response);
		}
	}

	static async resetPassword(req: Request, res: Response) {
		const { email } = req.body;
		const response = await UserService.resetPassword(email);
		if (response.ok) {
			res.status(200).json(response);
		} else {
			res.status(400).json(response);
		}
	}

	static async updatePassword(req: LoggedInRequest, res: Response) {
		const { password } = req.body;
		const { authorization } = req.headers;
		const token = authorization?.split(' ')[1];
		const response = await UserService.checkAndUpdatePassword(
			token as string,
			password,
		);
		if (response.ok) {
			res.status(200).json(response);
		} else {
			res.status(400).json(response);
		}
	}
}

export default UserController;
