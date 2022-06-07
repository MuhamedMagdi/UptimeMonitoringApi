import { Router } from 'express';
import {
    getUserReport,
    getAllUserReport,
} from '../controllers/report.controller';

const reportRouter = Router();

reportRouter.get('/', getAllUserReport);
reportRouter.get('/:checkId/check', getUserReport);

export default reportRouter;
