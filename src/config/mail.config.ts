import dotenv from 'dotenv';

dotenv.config();

const mailConfig = {
    host: process.env.MAIL_HOST as string,
    port: Number(process.env.MAIL_PORT),
    secure: Boolean(process.env.MAIL_SECURE),
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
    tls: process.env.MAIL_TLS,
    debug: false,
    logger: false,
};

export default mailConfig;
