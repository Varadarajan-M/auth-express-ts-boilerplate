import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Utils from '../util';
import User from '../models/user.model';
import { IUser } from '../types/User';
import { sendEmail } from '../email/email.service';
import { APIErrors } from '../errors';
import {
	getResetPassswordMailDetails,
	getVerificationMailDetails,
} from '../common';

class UserService {
	static async register({ email, password, username }: IUser) {
		try {
			const user = await User.findOne({ email });

			if (Utils.exists(user)) throw new Error(APIErrors.USER_EXISTS_ERROR);

			const hash = await bcrypt.hash(password, +process.env.SALT_ROUNDS ?? 5);

			const newUser = await User.create({
				email,
				password: hash,
				username,
				isVerified: false,
			});

			const token = jwt.sign({ id: newUser._id }, process.env.SECRET!, {
				expiresIn: '5m',
			});

			const apiUrl = Utils.isProduction()
				? process.env.API_URL_PROD
				: process.env.API_URL_DEV;

			const verificationEmailDetails = getVerificationMailDetails(
				process.env.USERNAME!,
				username,
				email,
				apiUrl,
				token,
			);
			console.log('User registered successfully, New user :', username);

			sendEmail(verificationEmailDetails);
			return {
				ok: true,
				message:
					'Registered successfully! Please check the link sent to your email to complete verification.',
			};
		} catch (e: any) {
			console.log(e.message);
			return { ok: false, error: e.message };
		}
	}

	static async verify(token: string) {
		try {
			const user = jwt.verify(token, process.env.SECRET!) as any;

			await User.findOneAndUpdate(
				{ _id: user.id },
				{ $set: { isVerified: true } },
			);

			console.log('User verification successful ');

			return { ok: true, message: 'User verification successful ' };
		} catch (e: any) {
			console.log(e.message);
			return { ok: false, error: APIErrors.CANNOT_VERIFY_USER };
		}
	}

	static async login(credentials: Pick<IUser, 'email' | 'password'>) {
		try {
			const user = await User.findOne({ email: credentials.email });

			if (!Utils.exists(user) || !user?.isVerified)
				throw new Error(APIErrors.CANNOT_LOGIN_ERROR);

			const isPasswordMatch = await bcrypt.compare(
				credentials.password,
				user.password,
			);

			if (!isPasswordMatch)
				throw new Error(APIErrors.INVALID_CREDENTIALS_ERROR);

			const token = jwt.sign(
				{ email: user.email, id: user._id },
				process.env.SECRET!,
				{ expiresIn: '60m' },
			);

			console.log('User logged in :', user.username, `<${user.email}>`);

			return {
				ok: true,
				data: {
					email: user.email,
					username: user.username,
					token,
				},
			};
		} catch (e: any) {
			console.log(e.message);
			return { ok: false, error: e.message };
		}
	}

	static async updatePassword(resetToken: string, password: string) {
		try {
			const hash = await bcrypt.hash(password, +process.env.SALT_ROUNDS ?? 5);

			await User.updateOne(
				{ resetToken },
				{ $set: { password: hash, resetToken: '' } },
			);

			return { ok: true, message: 'Updated password successfully' };
		} catch (e: any) {
			console.log(e.message);
			return { ok: false, error: e.message };
		}
	}

	static async resetPassword(email: string) {
		try {
			const user = await User.findOne({ email });

			if (!Utils.exists(user))
				throw new Error(APIErrors.USER_DOES_NOT_EXIST_ERROR);

			const token = jwt.sign({ id: user._id }, process.env.SECRET!, {
				expiresIn: '5m',
			});

			await User.updateOne({ email }, { $set: { resetToken: token } });

			const passwordUpdateUrl = Utils.isProduction()
				? process.env.PASSWORD_UPDATE_URL_CLIENT_PROD
				: process.env.PASSWORD_UPDATE_URL_CLIENT_DEV;

			const resetPasswordMailDetails = getResetPassswordMailDetails(
				process.env.USERNAME!,
				user.username,
				email,
				passwordUpdateUrl,
				token,
			);
			sendEmail(resetPasswordMailDetails);

			return {
				ok: true,
				message: 'Please check your mail for further instructions.',
			};
		} catch (e: any) {
			console.log(e.message);
			return { ok: false, error: e.message };
		}
	}

	static async checkAndUpdatePassword(resetToken: string, password: string) {
		try {
			jwt.verify(resetToken, process.env.SECRET);

			const user = await User.findOne({ resetToken });

			if (!Utils.exists(user))
				throw new Error(APIErrors.CANNOT_UPDATE_PASSWORD_ERROR);

			const response = await this.updatePassword(resetToken, password);

			return response;
		} catch (e: any) {
			console.log(e.message);
			return { ok: false, error: e.message };
		}
	}
}
export default UserService;
