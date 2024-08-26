import addTagsToWords from "../../../modules/add_tags_to_words.js";
import { WordBody } from "../../../schemas/word/body.js";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { getErrorMessage } from "../../../utils/getErrorMessage.js";
import { trimStrings } from "../../../utils/trimStrings.js";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.post("/", { schema: { body: WordBody } }, async function (req, reply) {
    const trimmedBody = trimStrings(req.body);

    const word = trimmedBody.word
    const description = trimmedBody.description
    const speechPart = trimmedBody.speechPart
    const origin = trimmedBody.origin
    const comment = trimmedBody.comment
    const ergative = trimmedBody.ergative
    const defaultMorfant = trimmedBody.defaultMorfant
    const tags = trimmedBody.tags
    const defs = trimmedBody.definitions
    const examples = trimmedBody.examples
    const conjugations = trimmedBody.conjugations;

    try {
      // const result = await app.pg.query(
      //   "INSERT INTO words(word, speech_part, origin, ergative, description, default_morfant) VALUES($1, $2, $3, $4, $5, $6) RETURNING id",
      //   [word, speechPart, origin, ergative, description, defaultMorfant]
      // );
      // const wordId = result.rows[0].id;

      const result = await app.db
        .insertInto('words')
        .values({
          word,
          speech_part: speechPart,
          origin,
          ergative,
          comment,
          description,
          default_morfant: defaultMorfant,
        })
        .returning('id')
        .execute();

      const wordId = result[0].id;

      // Insert defs into the PostgreSQL table
      // const defsQuery = "INSERT INTO definitions (definition, word_id) VALUES ($1, $2) RETURNING *";
      // for (const def of defs) {
      //   if (def.definition.length > 0) {
      //     const { definition } = def;
      //     await app.pg.query(defsQuery, [definition, wordId]);
      //   }
      // }

      for (const def of defs) {
        if (def.definition.length > 0) {
          const { definition } = def;
          await app.db
            .insertInto("definitions")
            .values({ definition, word_id: wordId })
            .returningAll()
            .execute();
        }
      }

      // Insert examples into the PostgreSQL table
      // const examplesQuery =
      //   "INSERT INTO examples (example, translation, word_id) VALUES ($1, $2, $3) RETURNING *";
      // for (const ex of examples) {
      //   if (ex.example.length > 0) {
      //     const { example, translation } = ex;
      //     await app.pg.query(examplesQuery, [example, translation, wordId]);
      //   }
      // }

      for (const ex of examples) {
        if (ex.example.length > 0) {
          const { example, translation } = ex;
          await app.db
            .insertInto("examples")
            .values({ example, translation, word_id: wordId })
            .returningAll()
            .execute();
        }
      }

      // const conjugationsQuery =
      //   "INSERT INTO conjugations (morfant, conjugation, translation, word_id) VALUES ($1, $2, $3, $4) RETURNING *";
      // for (const conjug of conjugations) {
      //   if (conjug.conjugation.length > 0) {
      //     const { morfant, conjugation, translation } = conjug;
      //     await app.pg.query(conjugationsQuery, [morfant, conjugation, translation, wordId]);
      //   }
      // }
      for (const con of conjugations) {
        if (con.conjugation.length > 0) {
          const { conjugation, morfant, translation } = con;
          await app.db
            .insertInto("conjugations")
            .values({ conjugation, morfant, translation, word_id: wordId })
            .returningAll()
            .execute();
        }
      }

      await addTagsToWords(wordId, tags, app);
      return reply.status(201).send({ status: "success", message: "Word has been added" });
    } catch (error) {
      app.log.error(`Error inserting word: ${getErrorMessage(error)}`);
      return reply.internalServerError('Internal Server Error');
    }
  });
}

export default routes;