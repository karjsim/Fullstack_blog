const config = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')
require('express-async-errors')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')

mongoose.set('strictQuery', false)

mongoose.connect(config.MONGODB_URI)
    .then(() => logger.info('Connected to MongoDb'))
    .catch( error => logger.error(`Connection to MongoDb failed: ${error}`))

app.use('/', express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(middleware.tokenExtractor)
app.use('/api/blogs/', blogRouter)
app.use('/api/users/', userRouter)
app.use('/api/login/', loginRouter)
if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/reset')
    app.use('/api/testing/', testingRouter)
}

app.use(middleware.errorHandler)
app.get('*', (req, res) => {
    res.redirect('/')
})
app.use(middleware.unknownEndpoint)

module.exports = app