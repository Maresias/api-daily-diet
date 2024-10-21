import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('daily_diet', (table) => {
    table.decimal('my_diet_is_ok').notNullable().after('description')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('daily_diet', (table) => {
    table.dropColumn('my_diet_is_ok')
  })
}
