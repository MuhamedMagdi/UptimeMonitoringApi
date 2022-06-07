import { Request, Response } from 'express';
import {
    CHECK,
    initCheck,
    createCheck,
    getUserCheck,
    getUserChecks,
    deleteUserCheck,
    updateUserCheck,
} from '../models/check.model';

import { removeWorker, setWorker, updateWorker } from '../utils/reporter';

const addCheck = async (req: Request, res: Response) => {
    try {
        const check: CHECK = req.body;
        check.userId = res.locals.user.id;
        const newCheck = await createCheck(check);
        setWorker(newCheck);
        res.status(201).send(newCheck);
    } catch (error) {
        res.status(500).send(error);
    }
};

const getAllChecks = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.user.id;
        const { tags } = req.query;
        const checks: CHECK[] = await getUserChecks(userId, tags);
        if (!checks.length) {
            res.status(404).send(checks);
            return;
        }
        res.send(checks);
    } catch (error) {
        res.status(500).send(error);
    }
};

const getCheck = async (req: Request, res: Response) => {
    try {
        const { checkId } = req.params;
        const userId = res.locals.user.id;
        const check = await getUserCheck(userId, checkId);
        if (check === null) {
            res.status(404).send(check);
            return;
        }
        res.send(check);
    } catch (error) {
        res.status(500).send(error);
    }
};

const deleteCheck = async (req: Request, res: Response) => {
    try {
        const { checkId } = req.params;
        const userId = res.locals.user.id;
        const check = await deleteUserCheck(userId, checkId);
        if (check === null) {
            res.status(404).send(check);
            return;
        }
        if (check._id) {
            removeWorker(check._id.toString());
        }
        res.send(check);
    } catch (error) {
        res.status(500).send(error);
    }
};

const updateCheck = async (req: Request, res: Response) => {
    try {
        let check: CHECK = req.body;
        const userId = res.locals.user.id;
        if (req.method === 'PUT') {
            check = initCheck(check);
        }
        const { checkId } = req.params;
        const updatedCheck = await updateUserCheck(userId, checkId, check);
        if (updatedCheck) {
            updateWorker(updatedCheck);
        }
        res.send(updatedCheck);
    } catch (error) {
        res.status(500).send(error);
    }
};

export { addCheck, getAllChecks, getCheck, deleteCheck, updateCheck };
