import { it, describe, beforeAll, afterAll, beforeEach, expect } from 'vitest'
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

    const responseGetId = await request(app.server)
      .get('/diet/lists')
      .set('Cookie', sessionId)
      .expect(200)

    const idDiet = responseGetId.body.diets[0].id

    await request(app.server)
      .patch(`/diet/${idDiet}`)
      .send({
        name: 'Cerveja',
        description: 'A cerveja será consumida apenas 1 vez por semana',
        myDietIsOk: 0,
      })
      .set('Cookie', sessionId)
      .expect(200)

    const editDiet = await request(app.server)
      .get(`/diet/${idDiet}`)
      .set('Cookie', sessionId)
      .expect(200)

    expect(editDiet.body.diet).toEqual(
      expect.objectContaining({
        name: 'Cerveja',
        description: 'A cerveja será consumida apenas 1 vez por semana',
        my_diet_is_ok: 0,
      }),
    )
  })

  it('should be possible to delete a diet', async () => {
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
        description: 'O arroz será cortado da dieta',
        myDietIsOk: 0,
      })
      .set('Cookie', sessionId)
      .expect(200)

    const responseGetId = await request(app.server)
      .get('/diet/lists')
      .set('Cookie', sessionId)

    const idDiet = responseGetId.body.diets[0].id

    await request(app.server)
      .delete(`/diet/${idDiet}`)
      .set('Cookie', sessionId)
      .expect(200)
  })

  it('should be possible list all diets', async () => {
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
        description: 'O arroz sera cortado da dieta',
        myDietIsOk: 1,
      })
      .set('Cookie', sessionId)
      .expect(200)

    await request(app.server).post('/diet').send({
      name: 'Cerveja',
      description: 'A cerveja somente uma vez por semana',
      myDietIsOk: 0,
    })

    const alldiet = await request(app.server)
      .get('/diet/lists')
      .set('Cookie', sessionId)

    expect(alldiet.body.diets).toEqual([
      expect.objectContaining({
        name: 'Arroz',
        description: 'O arroz sera cortado da dieta',
        my_diet_is_ok: 1,
      }),
    ])
    expect(afterAll).length(2)
  })

  it('should be possible to list one diet', async () => {
    const getSessionId = await request(app.server)
      .post('/user')
      .send({
        name: 'Zazau',
        email: 'zazau@email',
        password: '123',
      })
      .expect(200)

    const sessionId = getSessionId.get('Set-Cookie') ?? []

    await request(app.server)
      .post('/diet')
      .send({
        name: 'Arroz',
        description: 'O arroz será cortando da dieta',
        myDietIsOk: 1,
      })
      .set('Cookie', sessionId)
      .expect(200)

    const responseGetId = await request(app.server)
      .get('/diet/lists')
      .set('Cookie', sessionId)
      .expect(200)

    const idDiet = responseGetId.body.diets[0].id

    const specificDiet = await request(app.server)
      .get(`/diet/${idDiet}`)
      .set('Cookie', sessionId)
      .expect(200)

    expect(specificDiet.body.diet).toEqual(
      expect.objectContaining({
        name: 'Arroz',
        description: 'O arroz será cortando da dieta',
        my_diet_is_ok: 1,
      }),
    )
  })

  it('should be possible be list a metrics', async () => {
    const createUser = await request(app.server)
      .post('/user')
      .send({
        name: 'Zazau',
        email: 'zazau@email.com',
        password: '123',
      })
      .expect(200)

    const sessionId = createUser.get('Set-Cookie') ?? []

    await request(app.server)
      .post('/diet')
      .send({
        name: 'Arroz',
        description: 'O arroz será cortado da dieta',
        myDietIsOk: 1,
      })
      .set('Cookie', sessionId)
      .expect(200)

    const metrics = await request(app.server)
      .get('/diet/metrics')
      .set('Cookie', sessionId)
      .expect(200)

    expect(metrics.body.dietMetrics).toEqual(
      expect.objectContaining({ totalDeRefeiçõesRegistradas: 1 }),
    )
  })
})
