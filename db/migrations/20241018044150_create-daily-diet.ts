import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('daily_diet', (table) => {
    table.uuid('id').notNullable()
    table.text('name').notNullable()
    table.uuid('session_id').notNullable()
    table.text('description').notNullable()
    table.decimal('my_diet_is_ok').notNullable()

    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('updated_at')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('daily_diet')
}
