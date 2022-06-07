import { Request, Response, NextFunction } from 'express';

import { CHECK, checkExist } from '../models/check.model';

const validCheck = async (req: Request, res: Response, next: NextFunction) => {
    const check: CHECK = req.body;
    check.userId = res.locals.user.id;
    const valid: boolean = await checkExist(check);
    if (valid) {
        return res.status(400).send({ msg: 'duplicate check' });
    }
    next();
};

export { validCheck };
