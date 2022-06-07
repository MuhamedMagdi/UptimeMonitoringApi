import { Router } from 'express';
import userRouter from './user.routes';
import checkRouter from './check.routes';
import reportRouter from './report.routes';
import { validToken } from '../middlewares/user.middleware';

const routes = Router();

routes.use('/user', userRouter);
routes.use('/check', validToken, checkRouter);
routes.use('/report', validToken, reportRouter);

export default routes;
