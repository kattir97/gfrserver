// Update with your config settings.
require("dotenv").config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "localhost", // Your host, usually 'localhost'
      port: "5432", // Port on which PostgreSQL is running
      database: "neondump", // Your database name
      user: "postgres", // Your username
      password: "1412", // Your password
    },
  },
  // production: {
  //   client: "pg",
  //   connection: {
  //     host: process.env.NEON_HOST,
  //     // port: "5432", // Port on which PostgreSQL is running
  //     database: process.env.NEON_DB, // Your database name
  //     user: process.env.NEON_USER, // Your username
  //     password: process.env.NEON_PASSWORD,
  //     ssl: {
  //       rejectUnauthorized: true,
  //     },
  //     // Your password
  //   },
  production: {
    client: "pg",
    connection: {
      host: process.env.SUPA_HOST,
      port: process.env.SUPA_PORT, // Port on which PostgreSQL is running
      database: process.env.SUPA_DB, // Your database name
      user: process.env.SUPA_USER, // Your username
      password: process.env.SUPA_PASSWORD,
      ssl: {
        rejectUnauthorized: false,
      },
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
    },
  },
};
