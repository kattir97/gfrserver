import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { convertToCamelCase } from "../../../utils/caseConverter.js";
import { getErrorMessage } from "../../../utils/getErrorMessage.js";
import { assertIsOrderBy, assertIsSortBy } from "../../../utils/sortingTypeGuard.js";

interface QueryParams {
  limit?: number;
  offset?: number;
  sortBy?: 'create_at' | "word";
  orderBy?: "desc" | "asc";
}

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.get("/",
    async (req, reply) => {
      const { limit = 10, offset = 0, sortBy = "created_at", orderBy = "desc" } = req.query as QueryParams;
      try {

        assertIsSortBy(sortBy);
        assertIsOrderBy(orderBy);

        const countRes = await app.db.selectFrom('words').select(({ fn }) => [fn.count('id').as('count')]).executeTakeFirst();

        const words = await app.db.selectFrom('words')
          .selectAll()
          .orderBy(sortBy, orderBy)
          .limit(limit)
          .offset(offset)
          .execute();

        const defs = await app.db.selectFrom('definitions').selectAll().execute();
        const examples = await app.db.selectFrom('examples').selectAll().execute();
        const conjugations = await app.db.selectFrom('conjugations').selectAll().execute();

        const tags = await app.db.selectFrom('tags')
          .innerJoin('wordtags', 'wordtags.tag_id', 'tags.id')
          .select(['tags.tag', 'wordtags.word_id'])
          .execute();

        const wordsList = words.map((word) => {

          return {
            id: word.id,
            word: word.word,
            description: word.description,
            speechPart: word.speech_part,
            ergative: word.ergative,
            origin: word.origin,
            defaultMorfant: word.default_morfant,
            audio: word.audio,
            createdAt: word.created_at,

            definitions: defs
              .filter((def) => def.word_id === word.id)
              .map((def) => def.definition),
            examples: examples
              .filter((ex) => ex.word_id === word.id)
              .map((ex) => ({
                example: ex.example,
                translation: ex.translation,
              })),
            conjugations: conjugations
              .filter((con) => con.word_id === word.id)
              .map((con) => ({
                morfant: con.morfant,
                conjugation: con.conjugation,
                translation: con.translation,
              })),
            tags: tags.filter((tag) => tag.word_id === word.id).map((tag) => tag.tag),
          };
        });

        const wordsData = {
          count: countRes?.count ?? 0,
          words: wordsList,
        };

        return reply.code(200).send(convertToCamelCase(wordsData));
      } catch (error) {
        app.log.error(`Error fetching words: ${getErrorMessage(error)}`);
        return reply.internalServerError('Internal Server Error');
      }
    });


}

export default routes;



