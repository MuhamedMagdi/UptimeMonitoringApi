import mongoConnect from '../database/connect';
import { ObjectId } from 'mongoose';
import {
    USER,
    createUser,
    getUserByVerificationCode,
    getUserByEmail,
    getUserById,
    updateUser,
} from '../models/user.model';

import {
    Protocol,
    CHECK,
    createCheck,
    getChecks,
    getUserChecks,
    getUserCheck,
    updateUserCheck,
    deleteUserCheck,
    checkExist,
} from '../models/check.model';

import {
    Status,
    REPORT,
    createReport,
    getReports,
    getReport,
    updateReport,
    deleteReport,
} from '../models/report.model';


describe('Testing models', () => {
    beforeAll(async () => {
        await mongoConnect();
    });
    let userId: ObjectId;
    let checkId: ObjectId;
    let checksId: (ObjectId | undefined)[];
    describe('Testing user models', () => {
        const verification = `verification${Math.floor(Math.random() * 100000)}`;
        let newUser: USER;
        it('should create new user', async () => {
            let user: USER = {
                email: `magdi${Math.floor(Math.random() * 100000)}@gmail.com`,
                password: `123`,
                verification: {
                    verificationCode: verification
                }
            }
            newUser = await createUser(user);
            if(newUser._id){
                userId = newUser._id;
            }
            expect(newUser.verification.verificationCode).toBeDefined();
        })
        it('should update user verification status', async () => {
            newUser.verification.isVerified = true;
            newUser = (await updateUser(newUser)) ?? newUser;
            expect(newUser?.verification.isVerified).toBeTruthy();
        });
        it('should get user by verification code', async () => {
            const user = await getUserByVerificationCode(verification);
            expect(user?.email).toEqual(newUser.email);
        });
        it('should get user by email', async () => {
            const user = await getUserByEmail(newUser?.email);
            expect(user?.email).toEqual(newUser.email);
        });
        it('should get user by id', async () => {
            const user = await getUserById(userId.toString());
            expect(user?._id).toEqual(userId);
        });
    });
    
    describe('Testing Check Model', () => {
        it('should create new check', async ()=> {
            const newCheck: CHECK = {
                userId: userId.toString(),
                name: 'google',
                url: 'https://google.com',
                path:'/',
                protocol: Protocol.HTTPS,
                interval: 5,
                timeout: 10
            }
            const check: CHECK = await createCheck(newCheck);
            if(check._id){
                checkId = check._id;
            }
            newCheck._id = check._id;
            expect(check.name).toEqual(newCheck.name);
        })
        it('should return true for finding a check by id',async () => {
            const newCheck: CHECK = {
                userId: userId.toString(),
                name: 'google',
                url: 'https://google.com',
                protocol: Protocol.HTTPS,
                path:'/',
                interval: 5,
                timeout: 10
            }
            const exists: boolean = await checkExist(newCheck);
            expect(exists).toBeTruthy();
        });
        it('should get all checks', async () => {
            const checks: CHECK[] = await getChecks();
            checksId = checks.map((check) => {
                return check._id;
            });
            expect(checks.length).toBeGreaterThan(0);
        })
        it('should get all checks for user', async () => {
            const checks: CHECK[] = await getUserChecks(userId.toString());
            expect(checks.length).toBeGreaterThan(0);
        })
        it('should get specific check for a user', async () => {
            const check: CHECK | null = await getUserCheck(userId.toString(), checkId.toString());
            expect(check?._id).toEqual(checkId);
        });
        it('should update a check', async () => {
            let check: CHECK | null = {
                userId: userId.toString(),
                name: 'google',
                url: 'https://google.com',
                protocol: Protocol.HTTPS,
                interval: 5,
                timeout: 10,
                path: '/mail'
            }
            check = await updateUserCheck(userId.toString(), checkId.toString(), check);
            expect(check?.path).toEqual('/mail');
        });
        it('should delete a check', async () => {
            const check: CHECK | null = await deleteUserCheck(userId.toString(), checkId.toString());
            expect(check?._id).toEqual(checkId);
        });
    })
    describe('Testing report model', () => {
        it('should create new report', async () => {
            let newReport: REPORT = {
                availability: 0,
                checkId: checkId,
                downTime: 0,
                history: [],
                outage: 0,
                responseTime: 0,
                status: Status.UP,
                upTime: 0
            }
            const report: REPORT= await createReport(newReport);
            expect(report._id).toBeDefined();
        });
        it('should get all user reports', async () => {
            const reports: REPORT[] = await getReports(checksId);
            expect(reports.length).toBeGreaterThan(0);
        });
        it('should get one user report', async () => {
            const report: REPORT | null = await getReport(checkId.toString());
            expect(report).toBeDefined();    
        });
        it('should update report', async () => {
            let newReport: REPORT = {
                availability: 0,
                checkId: checkId,
                downTime: 0,
                history: [],
                outage: 0,
                responseTime: 0,
                status: Status.UP,
                upTime: 10
            }
            const report: REPORT = await updateReport(checkId, newReport);
            expect(report.upTime).toEqual(10);
        });
        it('should delete a report', async () => {
            const report: REPORT | null = await deleteReport(checkId);
            expect(report).toBeDefined();
        })
    });
})