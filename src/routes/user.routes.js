import {Router} from 'express';
import { registerUser } from '../controllers/user.controller.js';
import validatorMiddleware from '../middlewares/validator.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();
const middlewareArr = [
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        }
    ]),
    validatorMiddleware('userAuthSchema')
]

router.route("/register").post( middlewareArr ,registerUser);

export default router;