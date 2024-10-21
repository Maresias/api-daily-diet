import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('daily_diet', (table) => {
    table.uuid('id').first().notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('daily_diet', (table) => {
    table.dropColumn('id')
  })
}
