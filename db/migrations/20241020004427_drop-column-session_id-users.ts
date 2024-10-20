import type { Knex } from 'knex'

// eslint-disable-next-line
export async function up(knex: Knex): Promise<void> {}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('session_id')
  })
}
