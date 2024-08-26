// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "localhost", // Your host, usually 'localhost'
      port: "5432", // Port on which PostgreSQL is running
      database: "dictionary", // Your database name
      user: "postgres", // Your username
      password: "1412", // Your password
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
    },
  },
};
