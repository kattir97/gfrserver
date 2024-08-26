import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { QueryString } from "../../../schemas/word/params.js";
import { normalizeQuery } from "../../../utils/normalizeQuery.js";




const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.get("/search-words", {
    // request needs to have a querystring with a `name` parameter
    schema: {
      // request needs to have a querystring with a `name` parameter
      querystring: QueryString
    },
  }, async (req, reply) => {
    const query = req.query.query;
    const title = normalizeQuery(query);
    console.log('title', title, query)


    if (title) {
      const foundWords = await app.db.selectFrom('words').selectAll().where("word", 'like', `%${title}%`).execute();
      console.log('foundwords', foundWords);

      // Map each word to an array of definitions
      const definitions = await Promise.all(
        foundWords.map(async (word) => {
          // Fetch the definitions for the current word
          // const wordDefinitions = await fastify.pg.query(
          //   "SELECT definition FROM definitions WHERE word_id = $1",
          //   [word.id]
          // );
          const wordDefinitions = await app.db.selectFrom('definitions').select('definition').where('word_id', '=', word.id).execute();

          return wordDefinitions.map((def) => def.definition);
        })
      );

      // Combine the words and their definitions
      const combinedResults = foundWords.map((word, index) => {
        return {
          ...word,
          definitions: definitions[index],
        };
      });

      console.log(combinedResults);

      return combinedResults;
    }

  });
}

export default routes;