import { Router } from 'express';
import { register, verifyUser, signIn } from '../controllers/user.controller';
import {
    validEmail,
    validUser,
    verifiedUser,
} from '../middlewares/user.middleware';

const userRouter = Router();

userRouter.post('/register', validEmail, validUser, register);
userRouter.get('/verify/:verificationCode', verifyUser);
userRouter.post('/sign-in', validEmail, verifiedUser, signIn);

export default userRouter;
