exports.up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments("id").primary(); // Auto-incrementing primary key
    table.string("username", 255).notNullable().unique(); // Username column
    table.string("password", 255).notNullable(); // Password column
    table.string("role", 50).notNullable().defaultTo("user"); // Role column with default 'user'
    table.timestamp("created_at").defaultTo(knex.fn.now()); // Created at timestamp
    table.timestamp("updated_at").defaultTo(knex.fn.now()); // Updated at timestamp
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users"); // Rollback function to drop the table
};
