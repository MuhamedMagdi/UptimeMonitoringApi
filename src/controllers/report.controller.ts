import { Request, Response } from 'express';
import { CHECK, getUserChecks } from '../models/check.model';
import { getReports, getReport, REPORT } from '../models/report.model';

const getAllUserReport = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.user.id;
        const { tags } = req.query;
        const checks: CHECK[] = await getUserChecks(userId, tags);
        const checksId = checks.map((check) => {
            return check._id;
        });
        let reports = await getReports(checksId);
        reports = reports.map((report: REPORT) => {
            report.responseTime = report.responseTime / report.history.length;
            return report;
        });
        res.send(reports);
    } catch (error) {
        res.status(500).send(error);
    }
};

const getUserReport = async (req: Request, res: Response) => {
    try {
        const { checkId } = req.params;
        const report = await getReport(checkId);
        if (report === null) {
            res.status(404).send(report);
            return;
        }
        report.responseTime = report.responseTime / report.history.length;
        res.send(report);
    } catch (error) {
        res.status(500).send(error);
    }
};

export { getAllUserReport, getUserReport };
