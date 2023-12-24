import mongoose from "mongoose";
import { DB_NAME } from "../contsants.js";


const connectDB = async ()=> {
    try {
        const connectionInstance =  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`Mongodb connected. Db host name:- ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("Mongo db connection error",error);
    }
}

export default connectDB