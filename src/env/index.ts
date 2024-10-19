import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}

const envSchema = z.object({
  NODE_ENV: z.enum(['devolvement', 'test', 'production']),
  DATABASE_CLIENT: z.enum(['sqlite3', 'pg']),
  DATABASE_URL: z.string(),
  PORT: z.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variable', _env.error.format())

  throw new Error('Invalid environment variable')
}

export const env = _env.data
