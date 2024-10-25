import { it, describe, beforeAll, afterAll, beforeEach } from 'vitest'
import { execSync } from 'child_process'
import request from 'supertest'
import { app } from '../src/app'

describe('Create user', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    execSync('npm run knex -- migrate:rollback --all')
    execSync('npm run knex -- migrate:latest')
  })
  it('must be able to create a user', async () => {
    await request(app.server)
      .post('/user')
      .send({
        name: 'zazau',
        email: 'zazau@gmail.com',
        password: '123',
      })
      .expect(200)
  })
})
