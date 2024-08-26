// authUtils.js (or any appropriate filename)
import { FastifyReply } from 'fastify';
import { AuthenticatedRequest } from '../constants/types';

export const checkAdminRole = (req: AuthenticatedRequest, reply: FastifyReply, done: Function) => {

  console.log('REQQQQQQQQQQQQ', req)
  if (req.user.role === 'admin') {
    done();  // Proceed if the user is an admin
  } else {
    reply.code(403).send({ message: 'Forbidden' });  // Respond with a 403 Forbidden if not
  }
};