import jwt from "jsonwebtoken"
import { envConfig } from "../config/envConfig.js";
export const authMiddleware = (req, res, next) => {
    try {
        const authData = req.headers.authorization;
        if (!authData || !authData.includes('Bearer')) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }
        const token = authData.split(" ")[1];
        const userData = jwt.verify(token, envConfig.jwtSecret);
        req.userId = userData.userId;
        next();
    }
    catch (err) {
        console.log('err', err);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}