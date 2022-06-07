import {
    Status,
    RESPONSE_REPORT,
    REPORT,
    getReport,
    updateReport,
} from '../models/report.model';
import { CHECK, getChecks } from '../models/check.model';
import { getResponse } from './axios';
import { sendNotification } from './webhook';
import { sendEmail } from './mail';
import { ObjectId } from 'mongoose';

const runningChecks = new Map<string, NodeJS.Timer>();

const updateReportData = (
    report: REPORT,
    response: RESPONSE_REPORT
): REPORT => {
    const totalChecks: number = report.history.length;
    report.status = response.statusType ?? Status.UP;
    const lastRequest: number = report.history[totalChecks - 1];
    if (report.status === Status.UP) {
        report.upTime += (Date.now() - lastRequest) / 1000;
    } else {
        report.downTime += (Date.now() - lastRequest) / 1000;
        report.outage += 1;
    }
    report.responseTime += response.responseTime;
    report.availability = (1 - report.outage / (totalChecks + 1)) * 100;
    report.history = [...report.history, Date.now()];
    return report;
};

const newReportData = (
    response: RESPONSE_REPORT,
    checkId: ObjectId
): REPORT => {
    const report: REPORT = {
        checkId: checkId,
        status: Status.UP,
        availability: 100,
        upTime: 0,
        downTime: 0,
        outage: 0,
        responseTime: response.responseTime,
        history: [Date.now()],
    };
    if (response.statusType === Status.DOWN) {
        report.availability = 0;
        report.status = Status.DOWN;
        report.outage += 1;
    }
    return report;
};

const reporter = async (check: CHECK): Promise<RESPONSE_REPORT> => {
    const responseReport: RESPONSE_REPORT = await getResponse(check);
    let statusCode = 200;
    if (check.assert?.statusCode) {
        statusCode = check.assert.statusCode as number;
    }
    if (statusCode === responseReport?.status) {
        return { ...responseReport, statusType: Status.UP };
    }
    return { ...responseReport, statusType: Status.DOWN };
};

const setWorker = (check: CHECK): void => {
    const interval: NodeJS.Timer = setInterval(async () => {
        const response: RESPONSE_REPORT = await reporter(check);
        if (check._id === undefined) {
            return;
        }
        let report: REPORT | null = await getReport(check._id.toString());
        if (report) {
            report = updateReportData(report, response);
        } else {
            report = newReportData(response, check._id);
        }
        if (report.outage % (check.threshold ?? 1) === 0) {
            // const message = `There is a problem with your ${check.name} check`;
            // sendEmail(check, message);
            // if(check.webhook){
            //     const {url, config, messageField} = check.webhook;
            //     if (url){
            //         sendNotification(url, config, messageField, message);
            //     }
            // }
        }
        updateReport(check._id, report);
    }, check.interval * 1000);
    if (check._id) {
        runningChecks.set(check._id.toString(), interval);
    }
};

const removeWorker = (checkId: string): void => {
    const interval = runningChecks.get(checkId);
    clearInterval(interval);
    runningChecks.delete(checkId);
};

const initWorkers = async (): Promise<void> => {
    const checks: CHECK[] = await getChecks();
    checks.forEach((check: CHECK) => {
        setWorker(check);
    });
};

const updateWorker = async (check: CHECK): Promise<void> => {
    if (check._id) {
        const interval: NodeJS.Timer | undefined = runningChecks.get(
            check._id.toString()
        );
        clearInterval(interval);
        setWorker(check);
    }
};

export { reporter, setWorker, removeWorker, initWorkers, updateWorker };
