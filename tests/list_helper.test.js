const listHelper = require('../utils/list_helper')
const _ = require('lodash')

const listWithOneBlog = [
    {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0
    }
]


const listWithMultipleBlogs = [
    {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    },
    {
        _id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
        __v: 0
    },
    {
        _id: '5a422b891b54a676234d17fa',
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
        __v: 0
    },
    {
        _id: '5a422ba71b54a676234d17fb',
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
        __v: 0
    },
    {
        _id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
        __v: 0
    }
]

describe('dummy', () => {
    test('dummy returns one', () => {
        const blogs = []

        const result = listHelper.dummy(blogs)
        expect(result).toBe(1)
    })
})

describe('totalLikes', () => {

    test('of empty list to be zero' , () => {
        expect(listHelper.totalLikes([])).toBe(0)
    })

    test('of one blog to be likes of that' , () => {
        expect(listHelper.totalLikes(listWithOneBlog)).toBe( listWithOneBlog[0].likes )
    })

    test('of multiple blogs to be sum of likes' , () => {
        expect(listHelper.totalLikes(listWithMultipleBlogs)).toBe(36)
    })


})

describe('favoriteBlog', () => {

    const getExpectedBlog = (blog) => {
        const expectedResultProperties = ['author', 'likes', 'title']
        return _.pick(blog, expectedResultProperties)
    }

    test('of empty list to be null' , () => {
        expect(listHelper.favoriteBlog([])).toBe(null)
    })

    test('of one blog to be that', () => {
        expect(listHelper.favoriteBlog(listWithOneBlog)).toEqual(getExpectedBlog(listWithOneBlog[0]))
    })

    test('of multiple blogs to be one with highest likes', () => {
        expect(listHelper.favoriteBlog(listWithMultipleBlogs)).toEqual(getExpectedBlog(listWithMultipleBlogs[2]))
    })
})

describe('mostBlogs', () => {

    test('of one blog to be Michael Chan', () => {
        expect(listHelper.mostBlogs(listWithOneBlog)).toEqual({ author: 'Michael Chan', blogs: 1 })
    })

    test('of multiple blogs to be Robert C. Martin', () => {
        expect(listHelper.mostBlogs(listWithMultipleBlogs)).toEqual({ author: 'Robert C. Martin', blogs: 3 })
    })
})

describe('mostLikes', () => {

    test('of one blog to be Michael Chan', () => {
        expect(listHelper.mostLikes(listWithOneBlog)).toEqual({ author: 'Michael Chan', likes: 7 })
    })

    test('of multiple blogs to be Edsger W. Dijkstra', () => {
        expect(listHelper.mostLikes(listWithMultipleBlogs)).toEqual({ author: 'Edsger W. Dijkstra', likes: 17 })
    })
})