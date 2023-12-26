import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.routes.js'


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }))  // limiting json size
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())


app.use("/api/v1/users", userRouter);


app.use((err, req, res, next) => {
    console.log("app.use ==>",err.message);
    const status = err.status || 500;
    const message = err.message || 'Internal server error';
    return res.status(status).json({
        success: false,
        status,
        message
    })
})

export { app }