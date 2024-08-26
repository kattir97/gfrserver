// import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
// import { configurePassport } from "../../../modules/auth";

// const routes: FastifyPluginAsyncTypebox = async (app) => {
//   const fastifyPassport = configurePassport(app);

//   app.get('/admin', {
//     preHandler: [
//       fastifyPassport.authenticate('jwt', { session: false, }),
//       (req, reply, done) => {
//         console.log('Request User:', req.user); // Log the user object
//         if (req.user) {
//           done();  // Proceed if the user is an admin
//         } else {
//           console.log('Access denied: User is not an admin');
//           reply.code(403).send({ message: 'Forbidden' });  // Respond with a 403 Forbidden if not
//         }
//       }
//     ]
//   },
//     async (req, reply) => {
//       try {
//         return { message: 'Welcome, admin!' };
//       } catch (error) {
//         return error;
//       }
//     });
// }
// export default routes;