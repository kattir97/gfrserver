import { WordId } from "../../../schemas/word/params.js";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { getErrorMessage } from "../../../utils/getErrorMessage.js";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.delete("/:wordId", { schema: { params: WordId } }, async (req, reply) => {
    const wordId = parseInt(req.params.wordId);
    // await app.pg.query("DELETE FROM words WHERE id = $1", [wordId]);

    try {
      await app.db.deleteFrom('words').where('id', '=', wordId).execute();
      return { status: "success", message: "Word has been deleted" };
    } catch (error: unknown) {
      app.log.error(`Error deleting word with id ${wordId}: ${getErrorMessage(error)}`);
      return reply.internalServerError('Internal Server Error');
    }


  });
}

export default routes;

