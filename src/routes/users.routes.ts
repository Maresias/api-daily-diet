import { knex } from '../database'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'crypto'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserSchemaBody = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
    })

    const { name, email, password } = createUserSchemaBody.parse(request.body)

    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
      password,
    })
    return reply.status(200).send()
  })
}
