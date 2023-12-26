import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/Error.js';
import { User } from '../models/users.model.js';

export const veriFyJwtToken = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) return next(errorHandler(401, "Unauthorized request"))
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if(!decodedToken) return next(errorHandler(401, "Unauthorized request"))
        const user = await User.findById(decodedToken.id);
        if (!user) return next(errorHandler(401, "User not found"))
        req.user = user
        next()
    } catch (error) {
        return next(errorHandler(401, error.message))
    }
}