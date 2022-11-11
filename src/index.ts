import express from 'express';
import UserRoutes from './user/user.route';
import PrivateRoutes from './private-routes/private.route';
import { config } from 'dotenv';
import connectDb from './db/connection';
import Utils from './util';
import cors from 'cors';
import helmet from 'helmet';

config();
const main = async () => {
	const app = express();

	const PORT: number = +process.env.PORT! || 3000;

	app.use(cors());

	app.use(helmet());

	await connectDb();

	app.use(express.json());

	app.use('/api/user', UserRoutes);

	app.use('/api/private', PrivateRoutes);

	app.all('/api/health', (_, res: express.Response) =>
		res.status(200).json({ ok: true, message: 'Api is working...' }),
	);

	app.all('*', (_, res: express.Response) => {
		res.status(200).json({ ok: true, message: 'Go to /api/user to use user routes' });
	});

	app.listen(PORT, () => {
		Utils.isProduction() && console.log('Running in production mode');
		console.log(`Listening on port ${PORT}`);
	});
};

main().catch(console.log);
