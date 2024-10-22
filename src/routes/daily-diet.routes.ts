import { FastifyInstance } from 'fastify'
import { knex } from '../database'

import { z } from 'zod'
import { randomUUID } from 'crypto'

export async function dailyDiet(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createDietSchemaBody = z.object({
      name: z.string(),
      description: z.string(),
      myDietIsOk: z.number(),
    })

    const { name, description, myDietIsOk } = createDietSchemaBody.parse(
      request.body,
    )
    const sessionId = request.cookies.sessionId

    if (!sessionId) {
      throw new Error('Unauthorized user')
    }

    await knex('daily_diet').insert({
      id: randomUUID(),
      name,
      description,
      my_diet_is_ok: myDietIsOk,
      session_id: sessionId,
    })

    return reply.code(200).send()
  })

  app.patch('/:id', async (request, reply) => {
    const updateSchemaBody = z.object({
      name: z.string(),
      description: z.string(),
      myDietIsOk: z.number(),
    })

    const idParams = z.object({
      id: z.string().uuid(),
    })

    const { name, description, myDietIsOk } = updateSchemaBody.parse(
      request.body,
    )
    const { id } = idParams.parse(request.params)
    const sessionId = request.cookies.sessionId

    const diet = await knex('daily_diet').where({ session_id: sessionId, id })

    if (!diet.length) {
      throw new Error('diet not found')
    }

    await knex('daily_diet').where({ session_id: sessionId, id }).update({
      id,
      name,
      description,
      my_diet_is_ok: myDietIsOk,
      updated_at: knex.fn.now(),
    })

    return reply.code(200).send()
  })

  app.delete('/:id', async (request, reply) => {
    const idParamsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = idParamsSchema.parse(request.params)

    const sessionId = request.cookies.sessionId

    const diet = await knex('daily_diet').where({ session_id: sessionId, id })
    console.log(diet)

    if (!diet.length) {
      throw new Error('diet not found')
    }

    await knex('daily_diet').where({ session_id: sessionId, id }).delete()

    return reply.code(200).send()
  })

  app.get('/lists', async (request) => {
    const sessionId = request.cookies.sessionId
    if (!sessionId) {
      throw new Error('session ID not found')
    }
    const diets = await knex('daily_diet')
      .where({ session_id: sessionId })
      .first()

    return { diets }
  })

  app.get('/:id', async (request) => {
    const sessionId = request.cookies.sessionId
    if (!sessionId) {
      throw new Error('unauthorized')
    }

    const idParamsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = idParamsSchema.parse(request.params)

    const diet = await knex('daily_diet')
      .where({ session_id: sessionId, id })
      .first()

    if (!diet) {
      throw new Error('diet not found')
    }
    return { diet }
  })
}
