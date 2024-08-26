import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { RegisterUserDto } from "../../../schemas/auth/registerUserDto.js";
import bcrypt from 'bcryptjs';

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.post('/register', { schema: { body: RegisterUserDto } }, async (req, reply) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return reply.code(400).send({ message: 'Invalid input' });
      }

      const existingUser = await app.db.selectFrom('users').where('username', '=', username).executeTakeFirst();

      if (existingUser) {
        return reply.code(400).send({ statusCode: 400, status: 'failure', message: 'Пользователь с таким именем уже существует.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await app.db.insertInto('users').values({
        username,
        password: hashedPassword,
        role: 'user'
      }).execute()


      return {
        status: 'success',
      }

    } catch (error) {
      return reply.internalServerError('Internal Server Error');
    }
  });
}

export default routes;

