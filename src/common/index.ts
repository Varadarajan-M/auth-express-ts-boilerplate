import { IEmailOptions } from '../types/Email';

export const getVerificationMailDetails = (
	from: string,
	username: string,
	email: string,
	apiUrl: string,
	token: string,
): IEmailOptions => ({
	from,
	to: email,
	subject: 'Verification Email',
	html: `
			<div>
				<h3>Hello ${username}!</h3>
            	<p>Please click <a href="${apiUrl}/api/user/verify/?u=${token}">Here</a> to verify your email!!</p>
			</div>
					`,
});

export const getResetPassswordMailDetails = (
	from: string,
	username: string,
	email: string,
	url: string,
	token: string,
): IEmailOptions => ({
	from,
	to: email,
	subject: `Account : ${username} | Reset password`,
	html: `<div>
                <h3>Hello ${username}!!</h3>
                <p>Please click <a href="${url}?u=${token}">Here</a> to redirect to password reset page!!</p>
			</div>
        `,
});
