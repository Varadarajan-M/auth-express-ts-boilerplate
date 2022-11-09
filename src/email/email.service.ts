import { createTransport } from 'nodemailer';
import { IEmailOptions } from '../types/Email';

export const sendEmail = async (mailOptions: IEmailOptions): Promise<void> => {
	const transporter = createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			user: process.env.MAIL,
			pass: process.env.PASS,
		},
	});

	transporter.sendMail(mailOptions, (err, info) =>
		err
			? console.error(err)
			: console.info('Mail sent successfully to ', info.accepted[0] ?? ''),
	);
};
