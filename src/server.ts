import { app } from './app'
import { knex } from './database'
import { env } from './env'

app.get('/hello', async () => {
  const tb = await knex('sqlite_schema').select('*')

  return tb
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('Hello World! ')
  })
