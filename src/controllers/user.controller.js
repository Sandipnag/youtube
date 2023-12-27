import { User } from "../models/users.model.js";
import { uploadFileCloudinary } from "../utils/Cloudinary.js";
import { errorHandler } from "../utils/Error.js";
import { ApiResponse } from '../utils/ApiResponse.js';
import { deleteAllfiles } from "../utils/FileHelper.js";
import jwt from 'jsonwebtoken';
import { STATUS_CODES } from "../utils/StatusCodes.js";

const generateRefeshAccessToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        let accessToken = user.generateAccessToken();
        let refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        return errorHandler(STATUS_CODES.server.internal_server_error, 'Something went wrong', error)
    }
}

const registerUser = async (req, res, next) => {
    try {
        const { userName, fullName, email, password } = req.body;

        const existedUser = await User.findOne({
            $or: [{ userName }, { email }]
        })

        if (existedUser) {
            deleteAllfiles();
            return next(errorHandler(STATUS_CODES.client.bad_request, `User already exists with this email ${email} or userName ${userName}`));
        } else {
            if (!req.files?.avatar) return next(errorHandler(STATUS_CODES.client.bad_request, 'avatar filed is required!'));
            const avatarLocalPath = req.files?.avatar[0]?.path;
            if (!avatarLocalPath) return next(errorHandler(STATUS_CODES.client.bad_request, 'avatar image path required!'));
            let { url: avatarUrl } = await uploadFileCloudinary(avatarLocalPath);
            if (!avatarUrl) return next(errorHandler(STATUS_CODES.client.bad_request, 'Avatar file upload issue occurs'));
            let coverImageUrl = ""
            if (req.files?.coverImage) {
                if (Array.isArray(req.files?.coverImage)) {
                    const coverLocalPath = req.files?.coverImage[0]?.path;
                    if (!coverLocalPath) return next(errorHandler(STATUS_CODES.server.internal_server_error, 'cover image path required!'));
                    let { url } = await uploadFileCloudinary(coverLocalPath);
                    coverImageUrl = url;
                    if (!coverImageUrl) return next(errorHandler(STATUS_CODES.client.bad_request, 'Cover image upload issue occurs'));
                } else {
                    return next(errorHandler(STATUS_CODES.server.internal_server_error, 'Cover image file processing issue!'));
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
                return next(errorHandler(STATUS_CODES.server.internal_server_error, "Something went wrong while registering the user."))
            }
            return res.status(201).json(ApiResponse(200, 'User created successsfully!', createdUser))
        }
    } catch (error) {
        return next(errorHandler(STATUS_CODES.server.internal_server_error, error.message));
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
            let refreshToken = user.generateRefreshToken();
            user.refreshToken = refreshToken;
            const options = {
                httpOnly: true,
                secure: true
            }
            await user.save({ validateBeforeSave: false })
            res
                .status(200)
                .cookie('accessToken', accessToken, options)
                .cookie('refreshToken', refreshToken, options)
                .json(ApiResponse(200, "user found.", { userDetails: user, accessToken }))
        } else {
            return next(errorHandler(200, "User not found"));
        }

    } catch (error) {
        return next(errorHandler(STATUS_CODES.server.internal_server_error, 'Something went wrong', error))
    }
}

const refreshAccessToken = async (req, res, next) => {
    // find data from users collection by user id and refresh token
    // if data found then generate a new access token and send it to user
    // if no data ound then log out the user

    let incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) return next(errorHandler(STATUS_CODES.client.bad_request, "Unauthorised request!"))
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    const user = await User.findById(decodedToken.id)
    if (!user) return next(errorHandler(STATUS_CODES.client.bad_request, "Unauthorised request!"))
    if (user.refreshToken == incomingRefreshToken) {
        let { accessToken, refreshToken } = await generateRefeshAccessToken(decodedToken.id);
        const options = {
            httpOnly: true,
            secure: true
        }
        res
            .status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', refreshToken, options)
            .json(ApiResponse(200, "Access token generated.", { userDetails: user, accessToken }))
    } else {
        return next(errorHandler(STATUS_CODES.client.bad_request, "Unauthorised request!"))
    }
}

const changeUserPassword = async (req,res,next)=> {
    const {oldPassword,newPassword,confirmPassword} = req.body;
    const {user} = req;
    if(newPassword!=confirmPassword) return(next(errorHandler(STATUS_CODES.client.bad_request,"Password and Confirm password doesn't match.")));
    let isOldPasswordValid = await user.isPasswordCorrect(oldPassword);
    if(!isOldPasswordValid) return(next(errorHandler(STATUS_CODES.client.bad_request,"Old password doesn't match.")));
    user.password = newPassword;
    await user.save({validateBeforeSave:false})
    res.status(200).json(ApiResponse(200,"password has changed successfully."));
}

export { registerUser, login, refreshAccessToken, changeUserPassword }