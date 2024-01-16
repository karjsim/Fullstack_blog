const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const User = require('../models/user')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

describe('when some blogs are already saved', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        let passwordHash = await bcrypt.hash('rootpwd', 10)
        const rootUser = new User({ username: 'root', name: 'Root User',  passwordHash })
        await rootUser.save()
        passwordHash = await bcrypt.hash('adminpwd', 10)
        const adminUser = new User({ username: 'admin', name: 'Admin User',  passwordHash })
        await adminUser.save()
    })

    test('users are returned as json', async () => {
        await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('correct number of users is returned', async () => {
        const users = await api.get('/api/users')
        expect(users.body).toHaveLength(2)

    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'testuser',
            name: 'Test User',
            password: 'testpwd',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
        expect(usersAtEnd).toContainEqual({ id: expect.any(String), blogs: [], name: newUser.name, username: newUser.username })
    })

    test('creation fails with missing and too short username', async () => {

        let result = await api
            .post('/api/users')
            .send( { name: 'Test User', password: 'testpwd' })
            .expect(400)

        expect(result.body.error).toContain('Username is required')

        result = await api
            .post('/api/users')
            .send( { username: 'te', name: 'Test User', password: 'testpwd' })
            .expect(400)

        expect(result.body.error).toContain('is shorter than the minimum allowed length (3)')
    })

    test('creation fails with missing and too short password', async () => {

        let result = await api
            .post('/api/users')
            .send( { username: 'testuser', name: 'Test User' })
            .expect(400)

        expect(result.body.error).toContain('Missing or too short password')

        result = await api
            .post('/api/users')
            .send( { username: 'testuser', name: 'Test User', password: 'te' })
            .expect(400)

        expect(result.body.error).toContain('Missing or too short password')
    })

    test('creation fails with existing username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Test User',
            password: 'testpwd',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('Error, expected `username` to be unique. Value: `root`')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)

    })


})

afterAll(async () => {
    await mongoose.connection.close()
})