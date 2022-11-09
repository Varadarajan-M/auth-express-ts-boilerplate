import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Utils from '../util';
import User from '../models/user.model';
import { IUser } from '../types/User';
import { sendEmail } from '../email/email.service';

class UserService {
	static async register({ email, password, username }: IUser) {
		try {
			const user = await User.findOne({ email });
			if (Utils.exists(user)) {
				return { ok: false, error: 'User Exists' };
			}
			const hash = await bcrypt.hash(password, 5);

			const newUser = await User.create({
				email,
				password: hash,
				username,
				isVerified: false,
			});

			jwt.sign(
				{ id: newUser._id },
				process.env.SECRET!,
				{ expiresIn: '5m' },
				(err, token) => {
					if (err) {
						throw err;
					} else {
						sendEmail({
							from: process.env.USERNAME!,
							to: email,
							subject: 'Verification Email',
							html: `<div>
                        <h3>
                        Hello ${username}!</h3>
                        <p>Please click <a href="http://localhost:3000/api/user/verify/?u=${token}">Here</a> to verify your email!!</p></div>`,
						});
					}
				},
			);
			console.log('User registered successfully, New user :', username);
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
			const res = await User.findOneAndUpdate(
				{ _id: user.id },
				{ $set: { isVerified: true } },
			);
			console.log('User verification successful ');
			return { ok: true, message: 'User verification successful ' };
		} catch (e: any) {
			console.log(e.message);
			return { ok: false, error: 'cannot verify user' };
		}
	}

	static async login(credentials: Pick<IUser, 'email' | 'password'>) {
		try {
			const user = await User.findOne({ email: credentials.email });
			if (user?.isVerified) {
				const isPasswordMatch = await bcrypt.compare(
					credentials.password,
					user.password,
				);
				if (isPasswordMatch) {
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
				}
			}
			throw new Error('Cannot login');
		} catch (error: any) {
			console.log(error);
			return { ok: false, error: error.message };
		}
	}

	static async updatePassword(resetToken: string, password: string) {
		try {
			const hash = await bcrypt.hash(password, 5);
			await User.updateOne(
				{ resetToken },
				{ $set: { password: hash, resetToken: '' } },
			);
			return { ok: true, message: 'Updated password successfully' };
		} catch (error: any) {
			console.log(error.message);
			return { ok: false, error: error.message };
		}
	}

	static async resetPassword(email: string) {
		try {
			const user = await User.findOne({ email });
			if (Utils.exists(user)) {
				const token = jwt.sign({ id: user._id }, process.env.SECRET, {
					expiresIn: '5m',
				});
				user.resetToken = token;
				await user.save();
				sendEmail({
					from: process.env.USERNAME!,
					to: email,
					subject: `Account : ${user.username} | Reset password`,
					html: `<div>
                        <h3>
                        Hello ${user.username}!!</h3>
                        <p>Please click <a href="${process.env.CLIENT_PASSWORD_UPDATE__URL}?u=${token}">Here</a> to redirect to password reset page!!</p></div>`,
				});
				return {
					ok: true,
					message: 'Please check your mail for further instructions.',
				};
			}
			throw new Error("User doesn't exist");
		} catch (error: any) {
			console.log(error.message);
			return { ok: false, error: error.message };
		}
	}

	static async checkAndUpdatePassword(resetToken: string, password: string) {
		try {
			jwt.verify(resetToken, process.env.SECRET);
			const user = await User.findOne({ resetToken });
			if (Utils.exists(user)) {
				const response = await this.updatePassword(resetToken, password);
				return response;
			}
			throw new Error(`Cannot update password`);
		} catch (error: any) {
			console.log(error.message);
			return { ok: false, error: error.message };
		}
	}
}
export default UserService;
