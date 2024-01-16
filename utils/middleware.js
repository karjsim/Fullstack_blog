
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const errorHandler = (error, request, response, next) => {

    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    else if (error.name === 'CastError') {
        return response.status(400).send({ error: 'invalid id' })
    }
    else if (error.name ===  'JsonWebTokenError') {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({ error: 'token expired' })
    }

    next(error)
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })

}

const tokenExtractor = (request, response, next) => {

    const authorization = request.get('authorization')

    if (authorization && authorization.startsWith('Bearer '))
    {
        request.token = authorization.replace('Bearer ', '')
    }
    next()
}

const userExtractor = async (request, response, next) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }

    const user = await User.findById(decodedToken.id)
    request.user = user.id

    next()

}

module.exports = {
    errorHandler,
    unknownEndpoint,
    tokenExtractor,
    userExtractor
}