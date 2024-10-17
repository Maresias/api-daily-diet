import { app } from './app'
import { knex } from './database'

app.get('/hello', async () => {
  const tb = await knex('sqlite_schema').select('*')

  return tb
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('Hello World! ')
  })
