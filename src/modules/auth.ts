import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { FastifyInstance } from "fastify";
import { Authenticator } from "@fastify/passport";

export const configurePassport = (app: FastifyInstance) => {
  const fastifyPassport = new Authenticator()


  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: String(process.env.JWT_SECRET)
  }




  fastifyPassport.use('jwt', new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      console.log('JWTPAYLOAD', jwtPayload)
      const user = await app.db.selectFrom('users').selectAll().where('id', '=', jwtPayload.id).executeTakeFirst();
      if (user) {
        console.log('str user', user)
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (error) {
      done(error, false);
    }
  }));

  return fastifyPassport;
}





