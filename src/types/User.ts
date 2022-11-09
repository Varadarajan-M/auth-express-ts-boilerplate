import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface IUser {
	email: string;
	password: string;
	username: string;
	isVerified?: boolean;
}

export interface LoggedInRequest extends Request {
	user?: JwtPayload | undefined;
}
