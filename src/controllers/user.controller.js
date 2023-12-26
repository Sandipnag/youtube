import { User } from "../models/users.model.js";
import { uploadFileCloudinary } from "../utils/Cloudinary.js";
import { errorHandler } from "../utils/Error.js";
import { ApiResponse } from '../utils/ApiResponse.js';
import { deleteAllfiles } from "../utils/FileHelper.js";


const registerUser = async (req, res, next) => {
    try {
        const { userName, fullName, email, password } = req.body;

        const existedUser = await User.findOne({
            $or: [{ userName }, { email }]
        })

        if (existedUser) {
            deleteAllfiles();
            return next(errorHandler(401, `User already exists with this email ${email} or userName ${userName}`));
        } else {
            if (!req.files?.avatar) return next(errorHandler(401, 'avatar filed is required!'));
            const avatarLocalPath = req.files?.avatar[0]?.path;
            if (!avatarLocalPath) return next(errorHandler(401, 'avatar image path required!'));
            let { url: avatarUrl } = await uploadFileCloudinary(avatarLocalPath);
            if (!avatarUrl) return next(errorHandler(401, 'Avatar file upload issue occurs'));
            let coverImageUrl = ""
            if (req.files?.coverImage) {
                if (Array.isArray(req.files?.coverImage)) {
                    const coverLocalPath = req.files?.coverImage[0]?.path;
                    if (!coverLocalPath) return next(errorHandler(500, 'cover image path required!'));
                    let { url } = await uploadFileCloudinary(coverLocalPath);
                    coverImageUrl = url;
                    if (!coverImageUrl) return next(errorHandler(401, 'Cover image upload issue occurs'));
                } else {
                    return next(errorHandler(500, 'Cover image file processing issue!'));
                }
            }

            const user = await User.create({
                userName,
                fullName,
                email,
                password,
                avatar: avatarUrl,
                coverImage: coverImageUrl || ""
            })

            const createdUser = await User.findById(user._id).select("-password -refreshToken");
            if (!createdUser) {
                return next(errorHandler(500, "Something went wrong while registering the user."))
            }
            return res.status(201).json(ApiResponse(200, 'User created successsfully!', createdUser))
        }
    } catch (error) {
        return next(errorHandler(500, error.message));
    }


}

const login = async (req, res, next) => {
    try {
        const { email, userName } = req.body;
        let user = await User.findOne({
            $or: [{ userName }, { email }]
        })
        if (user) {
            let passwordMatchStatus = await user.isPasswordCorrect(req.body.password)
            if (!passwordMatchStatus) return next(errorHandler(200, "Wrong credentials"));
            let accessToken = user.generateAccessToken();
            let refreshToken = user.generatrRefreshToken();
            user.refreshToken = refreshToken;
            const options = {
                httpOnly: true,
                secure: true
            }
            user.save({ validateBeforeSave: false })
            res
                .status(200)
                .cookie('accessToken', accessToken, options)
                .cookie('refreshToken', refreshToken, options)
                .json(ApiResponse(200, "user found.", { userDetails: user, accessToken }))
        } else {
            return next(errorHandler(200, "User not found"));
        }

    } catch (error) {
        return next(errorHandler(500, 'Something went wrong', error))
    }
}

export { registerUser, login }