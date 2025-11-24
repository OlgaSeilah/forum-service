import express from 'express'
import mongoose from "mongoose";
import config from './config/config.js'
import postRoutes from "./routes/post.routes.js";

const app = express()

app.use(express.json())
app.use('/forum', postRoutes)
app.use((error, req, res, next) => {
    console.error(`Error: ${error.message}`)

    if (error.code === 404) {
        return res.status(404).send();
    }
    return res.status(500).json(
        {message: 'Internal server error'}
    )
})

const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoDb.uri, config.mongoDb.db)
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