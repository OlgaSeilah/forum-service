import express from 'express'
import cors from 'cors';
import mongoose from "mongoose";
import config from './config/config.js'
import postRoutes  from "./routes/post.routes.js";
import userRoutes from "./routes/userAccount.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import authenticationMiddleware from "./middlewares/authentication.middleware.js";
import {initAdmin} from "./config/initAdmin.js";

const app = express()
const corsPolicy = cors();

app.use(corsPolicy)

app.use(express.json())
app.use(authenticationMiddleware)

app.use('/forum', postRoutes)
app.use('/account', userRoutes)

app.use(errorMiddleware)

const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoDb.uri, config.mongoDb.db)
        await initAdmin();
        console.log('MongoDB Connected')

    } catch (error) {
        console.log(error)
    }
}

const startServer = async () => {
    await connectDB()
    app.listen(config.port, () => console.log(`Server is running on port ${config.port}`))
}

startServer();