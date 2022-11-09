import { model, Schema } from 'mongoose';

const UserSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
		unique: true,
	},
	isVerified: {
		type: Boolean,
		required: true,
		default: false,
	},
	resetToken: {
		type: String,
	},
});

const User = model('User', UserSchema);

export default User;
