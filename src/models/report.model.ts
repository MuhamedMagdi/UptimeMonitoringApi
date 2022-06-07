import { Schema, model, ObjectId } from 'mongoose';

enum Status {
    DOWN = 'DOWN',
    UP = 'UP',
}

interface RESPONSE_REPORT {
    statusType?: Status;
    status: number;
    responseTime: number;
}

interface REPORT {
    _id?: ObjectId;
    checkId: ObjectId;
    status: Status;
    availability: number;
    outage: number;
    downTime: number;
    upTime: number;
    responseTime: number;
    history: number[];
}

const reportSchema = new Schema<REPORT>({
    checkId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: [Status.DOWN, Status.UP],
        required: true,
    },
    availability: {
        type: Number,
        required: true,
        default: 0,
    },
    outage: {
        type: Number,
        required: true,
        default: 0,
    },
    downTime: {
        type: Number,
        required: true,
        default: 0,
    },
    upTime: {
        type: Number,
        required: true,
        default: 0,
    },
    responseTime: {
        type: Number,
        required: true,
        default: 0,
    },
    history: [
        {
            type: Number,
        },
    ],
});

const reportModel = model<REPORT>('Report', reportSchema);

const createReport = async (report: REPORT): Promise<REPORT> => {
    const newReport = new reportModel(report);
    await newReport.save();
    return newReport;
};

const getReports = async (
    checksId: (ObjectId | undefined)[]
): Promise<REPORT[]> => {
    const reports: REPORT[] = await reportModel
        .find({ checkId: { $in: checksId } })
        .exec();
    return reports;
};

const getReport = async (checkId: string): Promise<REPORT | null> => {
    const report: REPORT | null = await reportModel
        .findOne({ checkId: checkId })
        .exec();
    return report;
};

const updateReport = async (
    checkId: ObjectId,
    report: REPORT
): Promise<REPORT> => {
    const updatedReport: REPORT = await reportModel
        .findOneAndUpdate({ checkId: checkId }, report, {
            upsert: true,
            new: true,
        })
        .exec();
    return updatedReport;
};

const deleteReport = async (checkId: ObjectId): Promise<REPORT | null> => {
    const report: REPORT | null = await reportModel
        .findOneAndDelete({ checkId: checkId })
        .exec();
    return report;
};

export {
    RESPONSE_REPORT,
    Status,
    REPORT,
    createReport,
    getReports,
    getReport,
    updateReport,
    deleteReport,
};
