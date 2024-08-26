import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { LoginUserDto } from "../../../schemas/auth/loginUserDto.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { configurePassport } from '../../../modules/auth.js';
import { UserWithRole } from "../../../constants/types.js";


const routes: FastifyPluginAsyncTypebox = async (app) => {
  const fastifyPassport = configurePassport(app);

  app.post('/login', {
    schema: { body: LoginUserDto },
  }, async (req, reply) => {
    try {
      const { username, password } = req.body;

      const user = await app.db.selectFrom('users').selectAll().where('username', '=', username).executeTakeFirst();
      if (!user) {
        return reply.status(401).send({
          statusCode: 401,
          status: 'failure',
          message: 'Не верный логин или пароль.'
        })
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return reply.status(401).send({
          statusCode: 401,
          status: 'failure',
          message: 'Не верный логин или пароль.'
        })
      }

      const secret = String(process.env.JWT_SECRET);
      const token = jwt.sign({ id: user.id, role: user.role, username: user.username }, secret, { expiresIn: '7d' });

      return reply.code(200).send({
        statusCode: 200,
        status: 'success',
        token: token,
        user: user

      })

    } catch (error) {
      return reply.status(500).send({ status: 'failure', message: 'Unexpected Error' })
    }

  });


  app.get('/admin', {
    preHandler: [
      fastifyPassport.authenticate('jwt', { session: false }),
      (req, reply, done) => {
        const user = req.user as UserWithRole;
        if (user && user.role === 'admin') {
          done();  // Proceed if the user is an admin
        } else {
          return reply.status(403).send({
            statusCode: 403,
            status: 'failure',
            message: 'У вас нету прав администратора.'
          });
        }
      }
    ]
  },
    async (req, reply) => {
      try {
        return { status: 'success', message: 'Welcome, admin!' };
      } catch (error) {
        return reply.status(403).send({ stuts: 'failure', message: 'Unexpected Error' })
      }
    });

}


export default routes;