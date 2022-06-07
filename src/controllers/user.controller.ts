import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import config from '../config';
import {
    USER,
    createUser,
    getUserByVerificationCode,
    updateUser,
    getUserByEmail,
} from '../models/user.model';
import { signToken } from '../utils/jwt';
import { sendVerificationEmail } from '../utils/mail';

const register = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        let { password } = req.body;
        const verificationCode = await signToken({ email: email });
        password = await bcrypt.hash(
            password + config.app.bcryptPaper,
            config.app.bcryptRounds
        );
        await createUser({
            email,
            password,
            verification: {
                verificationCode: verificationCode,
            },
        });
        const verificationUrl = `${config.app.verifyUrl}/${verificationCode}`;
        sendVerificationEmail(email, verificationUrl);
        return res.status(201).send({ verification: verificationUrl });
    } catch (error) {
        return res.status(500).send(error);
    }
};

const verifyUser = async (req: Request, res: Response) => {
    try {
        const { verificationCode } = req.params;
        const user: USER | null = await getUserByVerificationCode(
            verificationCode
        );
        if (user === null) {
            return res.status(404).send({ msg: 'invalid verification code' });
        }
        user.verification.isVerified = true;
        const activatedUser = await updateUser(user);
        if (activatedUser === null) {
            return res.status(500).send({ msg: 'failed to verify the user' });
        }
        return res.send({ msg: 'user verified successfully' });
    } catch (error) {
        return res.status(500).send(error);
    }
};

const signIn = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user: USER | null = await getUserByEmail(email);
        if (user === null) {
            return res
                .status(401)
                .send({ msg: 'Username of password might not be correct' });
        }
        const equal = await bcrypt.compare(
            password + config.app.bcryptPaper,
            user.password as string
        );
        if (equal === false) {
            return res
                .status(401)
                .send({ msg: 'Username of password might not be correct' });
        }
        const token = await signToken({ email: user.email, _id: user._id });
        return res.send({ token: token });
    } catch (error) {
        return res.status(500).send(error);
    }
};
export { register, verifyUser, signIn };
