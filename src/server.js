import express from 'express'
import mongoose from "mongoose";
import config from './config/config.js'
import postRoutes  from "./routes/post.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express()

app.use(express.json()) // указывает на то, для каких роутов применять. тут нет ничего => для всех запросов

app.use('/forum', postRoutes) // тут подключаем миддлвар:
                            // "все, что приходит на /forum - перенаправить в файл с роутами для постов
// можно использ-ть app.all() - тгда будут обрабатываться все типы запросов
// в use мы передаем определенный глагол (тип запроса)
app.use(errorMiddleware)

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