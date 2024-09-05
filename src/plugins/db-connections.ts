import { Kysely, PostgresDialect } from 'kysely'
import pg from 'pg';
import { DB } from 'kysely-codegen'
import fp from 'fastify-plugin'
import { Static, Type } from '@sinclair/typebox';
import envSchema from 'env-schema';
import dotenv from 'dotenv';
dotenv.config();

const DatabaseConnectionsConfigSchema = Type.Object({
  default: Type.Object({
    host: Type.String(),
    port: Type.Number(),
    user: Type.String(),
    password: Type.String(),
    db: Type.String(),
  })
})

const config = envSchema<Static<typeof DatabaseConnectionsConfigSchema>>({
  schema: DatabaseConnectionsConfigSchema,
  data: {
    default: {
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      db: process.env.POSTGRES_DB,
    }
  },
})


const dialect = new PostgresDialect({
  pool: new pg.Pool({
    host: config.default.host,
    port: config.default.port,
    user: config.default.user,
    password: config.default.password,
    database: config.default.db,
    ssl: {
      rejectUnauthorized: false
    }
  })
})

export const db = new Kysely<DB>({
  dialect,
});

declare module 'fastify' {
  interface FastifyInstance {
    db: Kysely<DB>;
  }
}

export default fp(async (fastify) => {
  console.log()
  const db = new Kysely<DB>({
    dialect,
  });
  fastify.decorate('db', db);
  fastify.addHook('onClose', () => db.destroy());
  fastify.log.info('Connected to database');
});


