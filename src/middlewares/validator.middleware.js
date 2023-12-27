import * as Validators from '../schema_validators/index.js'
import { errorHandler } from '../utils/Error.js';
import { STATUS_CODES } from '../utils/StatusCodes.js';

export default function (validator) {
    return async function (req, res, next) {
        try {
            if (!Validators[validator]) return next(errorHandler(STATUS_CODES.server.internal_server_error, `Module '${validator}' does not exist in Validators.`))
            const validated = await Validators[validator].validateAsync(req.body);
            req.body = validated;
            next();
        } catch (err) {
            return next(errorHandler(STATUS_CODES.server.internal_server_error, err.message))
        }
    }
}