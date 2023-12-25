import { uploadFileCloudinary } from "../utils/Cloudinary.js";
import { errorHandler } from "../utils/Error.js";

const registerUser = async (req, res, next) => {
    try {
        const { userName, fullName, email, password } = req.body;
        if (!req.files?.avatar) return next(errorHandler(401, 'avatar filed is required!'));
        const avatarLocalPath = req.files?.avatar[0]?.path;
        if (!avatarLocalPath) return next(errorHandler(401, 'avatar image path required!'));
        let {url} = await uploadFileCloudinary(avatarLocalPath);
        res.status(200).json({ message: "ok", data: { userName, fullName, email, password, avatarPath: url } })
    } catch (error) {
        return next(errorHandler(500, error.message));
    }


}

export { registerUser }