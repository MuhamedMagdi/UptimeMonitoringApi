import jwt, { JwtPayload } from 'jsonwebtoken';

import config from '../config';

const signToken = async (payload: Record<string, unknown>): Promise<string> => {
    return jwt.sign(payload, config.app.jwtSecret, { expiresIn: '24h' });
};

const verifyToken = async (
    token: string
): Promise<boolean | JwtPayload | string> => {
    try {
        const decodedToken = await jwt.verify(token, config.app.jwtSecret);
        return decodedToken;
    } catch {
        return false;
    }
};

export { signToken, verifyToken };
