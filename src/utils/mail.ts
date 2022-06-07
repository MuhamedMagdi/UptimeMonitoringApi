import nodemailer from 'nodemailer';
import config from '../config';
import { CHECK } from '../models/check.model';
import { getUserById, USER } from '../models/user.model';

const mailConfig = {
    host: config.mail.host,
    port: config.mail.port,
    auth: {
        user: config.mail.user,
        pass: config.mail.pass,
    },
    debug: config.mail.debug,
    logger: config.mail.logger,
};

const mail = nodemailer.createTransport(mailConfig);

const sendVerificationEmail = (
    email: string,
    verificationUrl: string
): void => {
    mail.sendMail({
        from: config.app.defaultEmail,
        to: email,
        subject: 'Please confirm your account',
        text: `Verification code: ${verificationUrl}`,
    });
};

const sendEmail = async (check: CHECK, message: string): Promise<void> => {
    const user: USER | null = await getUserById(check.userId);
    if (user) {
        const email = user.email;
        await mail.sendMail({
            from: config.app.defaultEmail,
            to: email,
            subject: message,
            text: JSON.stringify(check),
        });
    }
};
export { sendVerificationEmail, sendEmail };
