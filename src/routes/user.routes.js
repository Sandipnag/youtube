import { Router } from 'express';
import { login, refreshAccessToken, registerUser } from '../controllers/user.controller.js';
import validatorMiddleware from '../middlewares/validator.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();
const middlewareArr = [
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        },
    ]),
    validatorMiddleware('userAuthSchema')
]

router.route("/register").post(upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 1
    },
]), validatorMiddleware('userAuthSchema'), registerUser);

router.route("/login").post(validatorMiddleware('loginSchema'), login);

router.route("/refreshAccessToken").post(refreshAccessToken);

export default router;