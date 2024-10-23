import { knex } from '../database'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function checkDietExist(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const idParamsSchema = z.object({
    id: z.string().uuid(),
  })
  const { sessionId } = request.cookies
  const { id } = idParamsSchema.parse(request.params)
  const diet = await knex('daily_diet').where({ session_id: sessionId, id })

  console.log(diet)

  if (!diet.length) {
    return reply.status(404).send({
      error: 'Diet not found',
    })
  }
}
