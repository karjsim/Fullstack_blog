const config = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const blogRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')

mongoose.set('strictQuery', false)

mongoose.connect(config.MONGODB_URI)
    .then(() => logger.info('Connected to MongoDb'))
    .catch( error => logger.error(`Connection to MongoDb failed: ${error}`))

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use('/api/blogs/', blogRouter)
app.use(middleware.unknownEndpoint)

module.exports = app