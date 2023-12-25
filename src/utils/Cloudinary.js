import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY
});

const uploadFileCloudinary = async (localFilePath)=> {
    try {
        if(!localFilePath) return null
        const response = await cloudinary.uploader.upload(localFilePath,{resource_type:'auto'});
        console.log("Uploaded File URL",response.url);
        return response
    } catch (error) {
        fs.unlink(localFilePath)
        return error
    }

}