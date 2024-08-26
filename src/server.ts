import autoload from '@fastify/autoload';
import { FastifyInstance } from 'fastify';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fastifyPassport from '@fastify/passport'
import fastifySecureSession from '@fastify/secure-session'
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("current file name:", __filename);
console.log('directory:', __dirname);


// Generate a 32-byte key
const key = crypto.randomBytes(32);

// Save the key to a file
fs.writeFileSync(path.join(__dirname, 'secret-key'), key);


export default async function (app: FastifyInstance) {
  app.register(fastifySecureSession, { key: fs.readFileSync(path.join(__dirname, 'secret-key')) });
  app.register(fastifyPassport.initialize());
  app.register(fastifyPassport.secureSession());
  app.register(import('@fastify/sensible'));
  app.register(autoload, {
    dir: join(__dirname, 'plugins'),
    forceESM: true,

  });
  app.register(autoload, {
    dir: join(__dirname, 'routes'),
    options: { prefix: '/api' },
    forceESM: true,
    routeParams: true,
  });

  app.ready(() => {
    app.log.info(app.printRoutes());
  })
}