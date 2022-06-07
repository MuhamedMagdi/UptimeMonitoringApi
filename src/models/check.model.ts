import { Schema, model, ObjectId } from 'mongoose';

enum Protocol {
    HTTP = 'HTTP',
    HTTPS = 'HTTPS',
    TCP = 'TCP',
}

interface CHECK {
    _id?: ObjectId;
    userId: string;
    name: string;
    url: string;
    protocol: Protocol;
    path?: string;
    port?: number;
    webhook?: {
        url: string;
        config?: object;
        messageField?: string;
    };
    timeout: number;
    interval: number;
    threshold?: number;
    authentication?: {
        useAuthentication: boolean;
        username?: string;
        password?: string;
    };
    httpHeaders?: {
        [header: string]: string;
    };
    assert?: {
        statusCode: number;
    };
    tags?: string[];
    ignoreSSL?: boolean;
}

const initCheck = (options?: Partial<CHECK>): CHECK => {
    let defaults: CHECK = {
        name: '',
        url: '',
        userId: '',
        protocol: Protocol.HTTP,
        path: '/',
        timeout: 5,
        interval: 10,
        threshold: 1,
        authentication: {
            useAuthentication: false,
        },
        assert: {
            statusCode: 200,
        },
    };
    if (options?.protocol === Protocol.HTTPS) {
        defaults = {
            ...defaults,
            ignoreSSL: true,
        };
    }
    return {
        ...defaults,
        ...options,
    };
};

const checkSchema = new Schema<CHECK>({
    userId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        lowercase: true,
    },
    url: {
        type: String,
        required: true,
    },
    protocol: {
        type: String,
        enum: [Protocol.HTTP, Protocol.HTTPS, Protocol.TCP],
        required: true,
    },
    path: {
        type: String,
    },
    port: {
        type: Number,
    },
    webhook: {
        url: {
            type: String,
        },
        config: {
            type: Object,
        },
        messageField: {
            type: String,
        },
    },
    timeout: {
        type: Number,
    },
    interval: {
        type: Number,
    },
    threshold: {
        type: Number,
    },
    authentication: {
        useAuthentication: {
            type: Boolean,
        },
        username: {
            type: String,
        },
        password: {
            type: String,
        },
    },
    assert: {
        statusCode: {
            type: Number,
        },
    },
    httpHeaders: {
        type: Map,
        of: String,
    },
    tags: [
        {
            type: String,
        },
    ],
    ignoreSSL: {
        type: Boolean,
    },
});

checkSchema.index({ name: 1, url: 1, path: 1, userId: 1 }, { unique: true });

const checksModel = model<CHECK>('Checks', checkSchema);

const createCheck = async (check: CHECK): Promise<CHECK> => {
    const initiatedCheck: CHECK = initCheck(check);
    const newCheck = new checksModel(initiatedCheck);
    await newCheck.save();
    return newCheck;
};

const getChecks = async (): Promise<CHECK[]> => {
    const checks: CHECK[] = await checksModel.find().exec();
    return checks;
};

const getUserChecks = async (
    userId: string,
    tags: Object = {}
): Promise<CHECK[]> => {
    const filters = {
        userId: userId,
        ...(Object.keys(tags).length && { tags: { $in: tags } }),
    };
    const checks: CHECK[] = await checksModel.find(filters).exec();
    return checks;
};

const getUserCheck = async (
    userId: string,
    checkId: string
): Promise<CHECK | null> => {
    const check: CHECK | null = await checksModel
        .findOne({ userId: userId, _id: checkId })
        .exec();
    return check;
};

const deleteUserCheck = async (
    userId: string,
    checkId: string
): Promise<CHECK | null> => {
    const deletedCheck: CHECK | null = await checksModel
        .findOneAndDelete({ userId: userId, _id: checkId })
        .exec();
    return deletedCheck;
};

const updateUserCheck = async (
    userId: string,
    checkId: string,
    check: CHECK
): Promise<CHECK | null> => {
    const updatedCheck: CHECK | null = await checksModel
        .findOneAndUpdate({ userId: userId, _id: checkId }, check, {
            new: true,
        })
        .exec();
    return updatedCheck;
};

const checkExist = async (check: CHECK): Promise<boolean> => {
    const exists = await checksModel
        .exists({
            name: check.name,
            url: check.url,
            path: check.path,
            userId: check.userId,
        })
        .exec();
    if (exists) {
        return true;
    }
    return false;
};

export {
    CHECK,
    initCheck,
    createCheck,
    getChecks,
    getUserChecks,
    getUserCheck,
    deleteUserCheck,
    updateUserCheck,
    checkExist,
};
