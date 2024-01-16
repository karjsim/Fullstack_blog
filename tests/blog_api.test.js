const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)
let TOKEN

beforeAll( async () => {
    const response = await api.post('/api/login').send({ username: 'admin', password: 'adminpwd' })
    TOKEN = response.body.token
})

describe('when some blogs are already saved', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        const promiseArray = helper.initialBlogs.map( blog => {
            return api.post('/api/blogs').set('Authorization' ,`Bearer ${TOKEN}`).send(blog)
        })
        await Promise.all(promiseArray )
        //await Blog.insertMany(helper.initialBlogs)
    })

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('correct number of blogs is returned', async () => {
        const blogs = await helper.blogsInDb()
        expect(blogs).toHaveLength(helper.initialBlogs.length)
    })

    test('blogs are identified with field \'id\' ', async () => {
        const blogs = await helper.blogsInDb()
        blogs.forEach ( blog => expect(blog.id).toBeDefined())
        blogs.forEach ( blog => expect(blog._id).not.toBeDefined())
    })

    test('getting specific blog', async () => {
        const blogs = await helper.blogsInDb()
        const blogToGet = blogs[0]

        const resultBlog =  await api
            .get(`/api/blogs/${blogToGet.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(resultBlog.body).toEqual({ ...blogToGet, user: expect.anything() })
    })

    test('if id is not found returns 404', async () => {

        const nonExistingId = await helper.getNonExistingId()
        await api
            .get(`/api/blogs/${nonExistingId}`)
            .expect(404)
    })

    test('if id is invalid fails with 400 ', async () => {
        const invalidId = '1234abcd'

        await api
            .get(`/api/blogs/${invalidId}`)
            .expect(400)
    })


    describe('adding a new blog', () => {

        test('new blog can be added', async () => {
            const newBlog = {
                title: 'New blog',
                author: 'New Person',
                url: 'www.newly-added.com',
                likes: 4
            }

            const result = await api.post('/api/blogs')
                .set('Authorization' ,`Bearer ${TOKEN}`)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const blogs = await helper.blogsInDb()
            expect(blogs).toHaveLength(helper.initialBlogs.length + 1)
            expect(blogs).toContainEqual({ id: expect.any(String), user: expect.anything(), ...newBlog })

            const resultBlog =  await api
                .get(`/api/blogs/${result.body.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            expect(resultBlog.body.user).toEqual({ id: expect.any(String), name: expect.any(String), username: expect.any(String)  })

        })

        test('if likes is not given it is initialized to 0', async () => {
            const newBlog = {
                title: 'New blog with no likes',
                author: 'New Person',
                url: 'www.newly-added.com'
            }

            await api.post('/api/blogs')
                .send(newBlog)
                .set('Authorization' ,`Bearer ${TOKEN}`)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const blogs = await helper.blogsInDb()
            expect(blogs).toContainEqual({ id: expect.any(String), likes: 0, user: expect.anything(), ...newBlog })

        })

        test('if title is not given 400 is returned', async () => {
            const newBlog = {
                author: 'Title Missing',
                url: 'www.title-missinng.com',
                likes: 2
            }

            await api.post('/api/blogs')
                .send(newBlog)
                .set('Authorization' ,`Bearer ${TOKEN}`)
                .expect(400)
                .expect('Content-Type', /application\/json/)

        })

        test('if url is not given 400 is returned', async () => {
            const newBlog = {
                title: 'Url missinng',
                author: 'Url Missing',
                likes: 2
            }

            await api.post('/api/blogs')
                .send(newBlog)
                .set('Authorization' ,`Bearer ${TOKEN}`)
                .expect(400)
                .expect('Content-Type', /application\/json/)

        })

        test('if token is missing 401 is returned', async () => {
            const newBlog = {
                title: 'New blog',
                author: 'New Person',
                url: 'www.newly-added.com',
                likes: 4
            }

            await api.post('/api/blogs')
                .send(newBlog)
                .expect(401)
                .expect('Content-Type', /application\/json/)

        })
    })

    describe('deleting blog', () => {
        test('delete existing blog', async () => {
            const blogs = await helper.blogsInDb()
            const blogToDelete = blogs[0]

            await api.delete(`/api/blogs/${blogToDelete.id}`)
                .set('Authorization' ,`Bearer ${TOKEN}`)
                .expect(204)

            const blogsAfterDeletion = await helper.blogsInDb()

            expect(blogsAfterDeletion).not.toContainEqual(blogToDelete)

        })
    })

    describe('Updating blog', () => {
        test('update blog', async () => {
            const blogs = await helper.blogsInDb()

            const blogInfoToUpdate = blogs[0]
            blogInfoToUpdate.url = 'www.updated-url.com'
            blogInfoToUpdate.likes = 42

            await api
                .put(`/api/blogs/${blogInfoToUpdate.id}`)
                .send(blogInfoToUpdate)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const blogsAfterUpdate = await helper.blogsInDb()
            expect(blogsAfterUpdate).toContainEqual(blogInfoToUpdate)
        })
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})