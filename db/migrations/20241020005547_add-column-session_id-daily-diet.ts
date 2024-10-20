import type { Knex } from 'knex'

// eslint-disable-next-line
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('daily_diet', (table) => {
    table.uuid('session_id').after('my_diet_is_ok').index()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('daily_diet', (table) => {
    table.dropColumn('session_id')
  })
}
