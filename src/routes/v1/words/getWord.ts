import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { WordId } from "../../../schemas/word/params.js";
import { getErrorMessage } from "../../../utils/getErrorMessage.js";
import { getWordData } from "../../../modules/get_word_data.js";


const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.get("/:wordId", { schema: { params: WordId } }, async (req, reply) => {
    const wordId = parseInt(req.params.wordId);
    try {
      return getWordData(app.db, wordId)
    } catch (error) {
      app.log.error(`Error retrieving word with id ${wordId}: ${getErrorMessage(error)}`);
      return reply.internalServerError('Internal Server Error');
    }
  });

  app.get("/test", async (req, res) => {
    return {
      status: 'success',
      statusCode: 200,
      message: 'request to api succefful'
    }
  })
}

export default routes;