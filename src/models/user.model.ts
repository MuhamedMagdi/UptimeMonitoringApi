import { Schema, model, ObjectId } from 'mongoose';

interface USER {
    _id?: ObjectId;
    email: string;
    password?: string;
    verification: {
        isVerified?: boolean;
        verificationCode: string;
    };
}

const userSchema = new Schema<USER>({
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    verification: {
        isVerified: {
            type: Boolean,
            default: false,
        },
        verificationCode: {
            type: String,
            immutable: true,
        },
    },
});

const userModel = model<USER>('User', userSchema);

const createUser = async (user: USER): Promise<USER> => {
    const newUser = new userModel(user);
    await newUser.save();
    return newUser;
};

const getUserByVerificationCode = async (
    verificationCode: string
): Promise<USER | null> => {
    const user: USER | null = await userModel
        .findOne({ 'verification.verificationCode': verificationCode })
        .exec();
    return user;
};

const getUserByEmail = async (email: string): Promise<USER | null> => {
    const user: USER | null = await userModel.findOne({ email: email }).exec();
    return user;
};

const getUserById = async (_id: string): Promise<USER | null> => {
    const user: USER | null = await userModel.findOne({ _id: _id }).exec();
    return user;
};

const updateUser = async (user: USER): Promise<USER | null> => {
    const updatedUser: USER | null = await userModel
        .findOneAndUpdate({ email: user.email }, user, {
            new: true,
        })
        .exec();
    return updatedUser;
};

export {
    USER,
    createUser,
    getUserByVerificationCode,
    getUserByEmail,
    getUserById,
    updateUser,
};
