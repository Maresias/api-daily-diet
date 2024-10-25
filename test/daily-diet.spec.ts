import { it, describe, beforeAll, afterAll, beforeEach } from 'vitest'
import { execSync } from 'child_process'
import request from 'supertest'
import { app } from '../src/app'

describe('daily-diet', () => {
  beforeAll(async () => {
    app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  beforeEach(async () => {
    execSync('npm run knex -- migrate:rollback --all')
    execSync('npm run knex -- migrate:latest')
  })

  it('should be possible to create a diet', async () => {
    const getSessionId = await request(app.server).post('/user').send({
      name: 'Zazau',
      email: 'zazau@email.com',
      password: '123',
    })

    const sessionId = getSessionId.get('Set-Cookie') ?? []

    await request(app.server)
      .post('/diet')
      .send({
        name: 'Arroz',
        description: 'O arroz deve ser cortado da sua dieta',
        myDietIsOk: 0,
      })
      .set('Cookie', sessionId)
      .expect(200)
  })

  it('should be possible to edit a diet', async () => {
    const getSessionId = await request(app.server)
      .post('/user')
      .send({
        name: 'Zazau',
        email: 'zazau@email.com',
        password: '123',
      })
      .expect(200)
    const sessionId = getSessionId.get('Set-Cookie') ?? []

    await request(app.server)
      .post('/diet')
      .send({
        name: 'Arroz',
        description: 'O arroz deve ser cortado da dieta',
        myDietIsOk: 1,
      })
      .set('Cookie', sessionId)
      .expect(200)

      await request(app.server).patch('/diet/')
  })
})
