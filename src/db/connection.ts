import { connect, connection } from 'mongoose';
import Utils from './../util';

const connectDb = async function () {
	connect(
		Utils.isProduction()
			? process.env.MONGO_URI_PROD
			: process.env.MONGO_URI_DEV,
	).catch((e) => console.log('Error connecting to database :', e.message));

	connection.on('connected', () => {
		console.log('Connected to Database');
	});
};

export default connectDb;
