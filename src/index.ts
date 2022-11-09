import express from 'express';
import UserRoutes from './user/user.route';
import ProtectedRoutes from './protectedroutes/protected.route';
import connectDb from './db/connection';
import { config } from 'dotenv';

config();

const main = async () => {
	const app = express();

	const PORT: number = +process.env.PORT! || 3000;

	await connectDb();

	app.use(express.json());

	app.use('/api/user', UserRoutes);

	app.use('/api/auth', ProtectedRoutes);

	app.listen(PORT, () => {
		console.log(`Listening on port ${PORT}`);
	});
};

main().catch(console.log);
