import express, { NextFunction, Request, Response } from 'express'
import { connectDB } from '../infrastructure/database/mongodb';
import userRouter from '../interface/routes/userRoutes'
import { config } from '../config/config';
import cors from 'cors'
import bodyParser from 'body-parser';
import { errorHandler } from '../interface/middleware/ErrorHandler';
import imageRouter from '../interface/routes/imageRoutes';
import cookieParser from 'cookie-parser';
import path from 'path';

const app = express()
const port = config.app.PORT;
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

//middlewares
app.use(cors({
    origin: config.cors.CLIENT_URL,
    allowedHeaders: config.cors.ALLOWED_HEADERS,
    methods: config.cors.ALLOWED_METHODS,
    credentials: config.cors.CREDENTIALS
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())

app.get('/', (req:Request, res:Response, next: NextFunction) => {
    res.status(200).json({success: true, message : 'API is working'})
})

app.use('/api/users', userRouter)
app.use('/api/users/images', imageRouter)

app.use(errorHandler)

app.listen(port, () => {
    console.log(`server is running on port http//:localhost:${port}`)
    connectDB();
})