const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const userExtractor = require('../utils/middleware').userExtractor

blogsRouter.get('/', async(request, response) => {
    const blogs = await Blog.find({}).populate('user', { id: 1, name: 1, username: 1 })
    response.json(blogs)
})

blogsRouter.get('/:id', async(request, response) => {
    const blog = await Blog.findById( request.params.id ).populate('user', { id: 1, name: 1, username: 1 })
    if (blog) {
        response.json(blog)
    }
    else {
        response.status(404).end()
    }
})

blogsRouter.post('/', userExtractor, async (request, response) => {

    const user = await User.findById(request.user)

    const blog = new Blog({ ...request.body, user: user._id })
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id',  userExtractor, async(request, response) => {

    const blog = await Blog.findById( request.params.id )
    if(blog) {
        if(blog.user.toString() === request.user.toString()) {
            await Blog.findByIdAndDelete( request.params.id )
        }
        else{
            return response.status(401).json({ error: 'Deletion allowed only for creating user' })
        }
    }

    response.status(204).end()
})

blogsRouter.put('/:id', async(request, response) => {
    const result = await Blog.findByIdAndUpdate( request.params.id, request.body, { new: true, runValidators: true, context: 'query' })
    response.json(result)
})

module.exports = blogsRouter