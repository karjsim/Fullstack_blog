const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: 'Fullstack training',
        author: 'Test Person',
        url: 'www.some-randon-url.com',
        likes: 2
    },
    {
        title: 'Programming is easy',
        author: 'Dave Developer',
        url: 'www.blog-url.com',
        likes: 6
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}


const getNonExistingId = async () => {
    const blog = new Blog({ title: 'Test title', url:'www.test.url' })
    await blog.save()
    await Blog.findByIdAndDelete(blog._id)
    return blog._id.toString()
}

module.exports = {
    initialBlogs,
    getNonExistingId,
    blogsInDb,
    usersInDb
}
