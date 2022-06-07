import { Router } from 'express';
import {
    addCheck,
    getAllChecks,
    getCheck,
    deleteCheck,
    updateCheck,
} from '../controllers/check.controller';
import { validCheck } from '../middlewares/check.middleware';

const checkRouter = Router();

checkRouter.post('/', validCheck, addCheck);
checkRouter.get('/', getAllChecks);
checkRouter.get('/:checkId', getCheck);
checkRouter.delete('/:checkId', deleteCheck);
checkRouter.patch('/:checkId', updateCheck);
checkRouter.put('/:checkId', updateCheck);

export default checkRouter;
