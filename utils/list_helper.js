
const _ = require('lodash')

const dummy = () => {
    return 1
}

const totalLikes = (blogs) => {
    const sumLikes = (totalLikes, blog) => {
        return totalLikes + blog.likes
    }

    return blogs.reduce(sumLikes, 0)
}

const favoriteBlog = (blogs) => {

    if(blogs.length === 0) { return null }

    return _.pick(_.maxBy(blogs, 'likes'), ['author', 'likes', 'title'])
}

const mostBlogs = (blogs) => {
    const result = _.countBy(blogs, 'author')
    return _.maxBy(_.map( result, (blogs, author) => { return { author: author, blogs: blogs } }), 'blogs')
}

const mostLikes= (blogs) => {
    const blogsByAuthor = _.groupBy(blogs, 'author')
    const likesByAuthor = _.map(blogsByAuthor, (blogs, author) => { return {  author: author, likes: _.sumBy(blogs, 'likes') }})
    return _.maxBy( likesByAuthor, 'likes')
}



module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}