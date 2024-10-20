import { FastifyInstance } from 'fastify'

import { z } from 'zod'

export async function dailyDiet(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createDietSchemaBody = z.object({
      name: z.string(),
      description: z.string(),
      myDietIsOk: z.boolean(),
    })

    const { name, description, myDietIsOk } = createDietSchemaBody.parse(
      request.body,
    )

    return reply.send({ name, description, myDietIsOk })
  })
}
