// eslint-disable-next-line
import { Knex } from "knex";

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: string
      password: string
      created_at: string
      updated_at?: string
    }
    daily_diet: {
      name: string
      description: string
      my_diet_is_ok: string
      created_at: string
      updated_at?: string
      session_id: string
    }
  }
}
