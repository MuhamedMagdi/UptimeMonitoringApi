import dotenv from 'dotenv';

dotenv.config();

const mongoConfig = {
    username: process.env.MONGODB_USERNAME,
    password: process.env.MONGODB_PASSWORD,
    host: process.env.MONGODB_HOST,
};

export default mongoConfig;
