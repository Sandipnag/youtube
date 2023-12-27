import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/Error.js';
import { User } from '../models/users.model.js';
import { STATUS_CODES } from '../utils/StatusCodes.js';

export const veriFyJwtToken = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) return next(errorHandler(STATUS_CODES.client.bad_request, "Unauthorized request"))
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if(!decodedToken) return next(errorHandler(STATUS_CODES.client.bad_request, "Unauthorized request"))
        const user = await User.findById(decodedToken.id);
        if (!user) return next(errorHandler(STATUS_CODES.client.bad_request, "User not found"))
        req.user = user
        next()
    } catch (error) {
        return next(errorHandler(STATUS_CODES.client.bad_request, error.message))
    }
}