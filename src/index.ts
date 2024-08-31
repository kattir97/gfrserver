import fastify from "fastify";
import buildServer from "./server.js"
import cors from '@fastify/cors';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const app = fastify({
    logger: {
      transport: {
        target: 'pino-pretty'
      },

    },
  });

  // app.register(fastifyPostgres, {
  //   connectionString: "postgres://postgres:1412@localhost/dictionary",
  // });

  const corsConfig = process.env.NODE_ENV === 'production' ? {
    origin: 'https://kattir97-gfrclient-7a56.twc1.net',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  } : { origin: '*' }


  app.register(cors, corsConfig);

  //   {
  //   origin: 'https://kattir97-gfrclient-7a56.twc1.net',
  //   methods: ['GET', 'POST', 'PUT', 'DELETE'],
  //   allowedHeaders: ['Content-Type', 'Authorization'],
  //   credentials: true,
  //   origin: '*'
  // }




  app.register(buildServer)

  const port = process.env.PORT || 10000

  try {
    await app.listen({
      port: Number(port),
      host: "0.0.0.0",
    });
    app.log.info(app.server.listen)
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }

}

run();