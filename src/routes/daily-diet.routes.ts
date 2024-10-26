import { FastifyInstance } from 'fastify'
import { knex } from '../database'

import { z } from 'zod'
import { randomUUID } from 'crypto'
import { console } from 'inspector'
import { checkSessionIdExist } from '../middlewares/check-session-id-exist'
import { checkDietExist } from '../middlewares/check-diet-exist'

export async function dailyDiet(app: FastifyInstance) {
  app.post(
    '/',
    { preHandler: [checkSessionIdExist] },
    async (request, reply) => {
      const createDietSchemaBody = z.object({
        name: z.string(),
        description: z.string(),
        myDietIsOk: z.number(),
      })

      const { name, description, myDietIsOk } = createDietSchemaBody.parse(
        request.body,
      )
      const { sessionId } = request.cookies

      await knex('daily_diet').insert({
        id: randomUUID(),
        name,
        description,
        my_diet_is_ok: myDietIsOk,
        session_id: sessionId,
      })

      return reply.code(200).send()
    },
  )

  app.patch(
    '/:id',
    { preHandler: [checkSessionIdExist, checkDietExist] },
    async (request, reply) => {
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
      const { sessionId } = request.cookies

      await knex('daily_diet').where({ session_id: sessionId, id }).update({
        id,
        name,
        description,
        my_diet_is_ok: myDietIsOk,
        updated_at: knex.fn.now(),
      })

      return reply.code(200).send()
    },
  )

  app.delete(
    '/:id',
    { preHandler: [checkSessionIdExist] },
    async (request, reply) => {
      const idParamsSchema = z.object({
        id: z.string().uuid(),
      })
      const { id } = idParamsSchema.parse(request.params)

      const { sessionId } = request.cookies

      const diet = await knex('daily_diet').where({ session_id: sessionId, id })
      console.log(diet)

      if (!diet.length) {
        throw new Error('diet not found')
      }

      await knex('daily_diet').where({ session_id: sessionId, id }).delete()

      return reply.code(200).send()
    },
  )

  app.get('/lists', { preHandler: [checkSessionIdExist] }, async (request) => {
    const sessionId = request.cookies.sessionId
    const diets = await knex('daily_diet').where({ session_id: sessionId })

    return { diets }
  })

  app.get(
    '/:id',
    { preHandler: [checkSessionIdExist] },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const idParamsSchema = z.object({
        id: z.string().uuid(),
      })
      const { id } = idParamsSchema.parse(request.params)

      const diet = await knex('daily_diet')
        .where({ session_id: sessionId, id })
        .first()

      if (!diet) {
        return reply.status(404).send({
          error: 'Diet not found',
        })
      }
      return { diet }
    },
  )

  app.get(
    '/metrics',
    { preHandler: [checkSessionIdExist] },
    async (request) => {
      const { sessionId } = request.cookies

      const allDiet = await knex('daily_diet')
        .where({ session_id: sessionId })
        .count('id', { as: 'Total de refeições registradas' })

      const totalNumberOfMealsWithinTheDiet = await knex('daily_diet')
        .where({
          session_id: sessionId,
        })
        .sum('my_diet_is_ok', { as: 'total de refeições dentro da dieta' })

      const totalNumberOfMealsOutsideTheDiet = await knex('daily_diet')
        .count('my_diet_is_ok', { as: 'total de refeições fora da dieta' })
        .where({ session_id: sessionId })
        .where('my_diet_is_ok', 0)

      const diets = await knex('daily_diet')
        .select('my_diet_is_ok')
        .where({ session_id: sessionId })

      const dietList = diets.map((element) => {
        return `${element.my_diet_is_ok}`
      })
      let interado = 0
      let bestSequel = 0
      let temporarySequence = 0

      while (interado <= dietList.length) {
        if (Number(dietList[interado]) === 1) {
          temporarySequence += Number(dietList[interado])
        } else {
          bestSequel = temporarySequence
          if (temporarySequence > bestSequel) {
            bestSequel = temporarySequence
          }
          temporarySequence = 0
        }
        interado++
      }
      const bestSequenceOfMealsWithinTheDiet = [
        {
          'Melhor sequência de refeições dentro da dieta': bestSequel,
        },
      ]
      const metrics = [
        ...allDiet,
        ...totalNumberOfMealsOutsideTheDiet,
        ...totalNumberOfMealsWithinTheDiet,
        ...bestSequenceOfMealsWithinTheDiet,
      ]
      return {
        metrics,
      }
    },
  )
}
