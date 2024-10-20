import { fastify } from 'fastify'
import { usersRoutes } from './routes/users.routes'
import { dailyDiet } from './routes/daily-diet.routes'
import cookie from '@fastify/cookie'

export const app = fastify()

app.register(cookie)

app.register(usersRoutes, {
  prefix: 'user',
})

app.register(dailyDiet, {
  prefix: 'diet',
})
