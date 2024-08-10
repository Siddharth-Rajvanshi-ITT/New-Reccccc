import dotenv from 'dotenv';

dotenv.config();

export default {
    DB_NAME: process.env.DB_NAME || 'recommendation_engine1',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || 'amisha',
    DB_HOST: process.env.DB_HOST || '127.0.0.1',
};