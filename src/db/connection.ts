import { connect, connection } from 'mongoose';

const connectDb = async function () {
    const MONGO_URI = process.env.MONGO_URI || '';

    connect(MONGO_URI).catch((e) => console.log('Error connecting to database :', e.message));

    connection.on('connected', () => {
        console.log('Connected to Database');
    });
};

export default connectDb;
