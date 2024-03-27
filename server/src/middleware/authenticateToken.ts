import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
    userId: number;
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) return res.sendStatus(401); // No token, unauthorized

    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
        if (err) return res.sendStatus(403); // Token is not valid or expired
        req.user = user as UserPayload;
        next(); // Token is valid, proceed
    });
};

export default authenticateToken;