import { Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { LoggedInRequest } from '../types/User';
import Utils from '../util';

const verifyAuth = async (
	req: LoggedInRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { authorization } = req.headers;
		const token = authorization?.split(' ')[1];
		const user = verify(token as string, process.env.SECRET!) as any;
		if (!Utils.exists(user?.id)) throw new Error('Authentication failed');
		req.user = user;
		next();
	} catch (error: any) {
		res.status(401).json({ ok: false, error: error.message });
	}
};

export default verifyAuth;
