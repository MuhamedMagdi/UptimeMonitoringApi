import { signToken, verifyToken } from "../utils/jwt";

describe('Testing JWT', () => {
    it('should verify jwt payload', async ()=>{
        const payload = {name: 'Magdi'};
        const token = await signToken(payload);
        const decodedToken = await verifyToken(token);
        expect(decodedToken).toBeTruthy();
    })
})