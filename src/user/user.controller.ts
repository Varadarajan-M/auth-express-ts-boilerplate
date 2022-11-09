import { Request, Response } from 'express';
import UserService from './user.service';
import { LoggedInRequest } from '../types/User';

class UserController {
	static async register(req: Request, res: Response) {
		const { email, password, username } = req.body;
		const registered = await UserService.register({
			email,
			password,
			username,
		});
		if (registered.ok) {
			res.status(201).json(registered);
		} else {
			res.status(400).json(registered);
		}
	}

	static async verify(req: Request, res: Response) {
		const verified = await UserService.verify(req.query?.u as string);
		if (!verified.ok) {
			res.redirect(process.env.CLIENT_FAILURE_REDIRECT_URL);
		} else {
			res.redirect(process.env.CLIENT_SUCCESS_REDIRECT_URL);
		}
	}

	static async login(req: Request, res: Response) {
		const { email, password } = req.body;
		const loggedIn = await UserService.login({ email, password });
		if (loggedIn.ok) {
			res.status(200).json({ ok: true, user: loggedIn.data });
		} else {
			res.status(400).json({ ok: false, error: loggedIn.error });
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
		const { resettoken: resetToken } = req.headers;
		const response = await UserService.checkAndUpdatePassword(
			resetToken as string,
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
