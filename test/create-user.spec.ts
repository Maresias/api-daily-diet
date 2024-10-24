import { it, describe } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

describe('Create user', () => {
  it('must be able to create a user', async () => {
    await request(app.server)
    .
  })
})
