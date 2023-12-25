import {Router} from 'express';
import { registerUser } from '../controllers/user.controller.js';
import validatorMiddleware from '../middlewares/validator.middleware.js';

const router = Router();

router.route("/register").post([validatorMiddleware('userAuthSchema')],registerUser);

export default router;