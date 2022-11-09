import { Request, Response, NextFunction } from 'express';
import { EMAIL_REGEX } from '../constants';
import Utils from '../util';
import { verify } from 'jsonwebtoken';

class UserValidator {
	static validateEmail(req: Request, res: Response, next: NextFunction) {
		const email = req.body.email || '';
		EMAIL_REGEX.test(email)
			? next()
			: res.status(400).json({ ok: false, error: 'Invalid Email' });
	}

	static validatePassword(req: Request, res: Response, next: NextFunction) {
		const password = req.body?.password || '';
		Utils.exists(password) && Utils.hasLength(password, 8)
			? next()
			: res.status(400).json({ ok: false, error: 'Invalid Password' });
	}

	static validateUsername(req: Request, res: Response, next: NextFunction) {
		const username = req.body?.username || '';
		Utils.exists(username) && Utils.hasLength(username, 2)
			? next()
			: res.status(400).json({ ok: false, error: 'Invalid Username' });
	}

	static validateResetToken(req: Request, res: Response, next: NextFunction) {
		const resetToken = req.headers['resettoken'] || null;
		Utils.exists(resetToken)
			? next()
			: res.status(400).json({ ok: false, error: 'Invalid token' });
	}
}

export default UserValidator;
