import express, { Response } from 'express';
import { LoggedInRequest } from '../types/User';
import verifyAuth from '../middlewares/auth';

const router = express.Router();

// the same format can be used for different protected routes
router.get(
	'/protected-content',
	verifyAuth,
	(req: LoggedInRequest, res: Response) => {
		res.status(200).json({ ok: true, message: 'You are authenticated' });
	},
);

export default router;
