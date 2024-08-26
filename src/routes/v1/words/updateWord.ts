import addTagsToWords from "../../../modules/add_tags_to_words.js";
import { WordId } from "../../../schemas/word/params.js";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { WordBody } from "../../../schemas/word/body.js";
import { getErrorMessage } from "../../../utils/getErrorMessage.js";
import { trimStrings } from "../../../utils/trimStrings.js";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.put("/:wordId", { schema: { params: WordId, body: WordBody } }, async (req, reply) => {
    const wordId = parseInt(req.params.wordId);

    const trimmedBody = trimStrings(req.body);

    const word = trimmedBody.word
    const description = trimmedBody.description
    const speechPart = trimmedBody.speechPart
    const origin = trimmedBody.origin
    const ergative = trimmedBody.ergative
    const comment = trimmedBody.comment
    const defaultMorfant = trimmedBody.defaultMorfant
    const tags = trimmedBody.tags
    const defs = trimmedBody.definitions
    const examples = trimmedBody.examples
    const conjugations = trimmedBody.conjugations;


    try {
      // await app.pg.query(
      //   "UPDATE words SET word = $1, speech_part = $2, origin = $3, ergative = $4, description = $5, default_morfant = $6 WHERE words.id = $7",
      //   [word, speechPart, origin, ergative, description, defaultMorfant, wordId]
      // );

      await app.db
        .updateTable('words')
        .set({
          word: word,
          speech_part: speechPart,
          origin: origin,
          comment: comment,
          ergative: ergative,
          description: description,
          default_morfant: defaultMorfant,
        })
        .where('id', '=', wordId)
        .execute();


      // await app.pg.query("DELETE FROM definitions WHERE word_id = $1", [wordId]);
      // for (let def of defs) {
      //   if (def.definition.length > 0) {
      //     await app.pg.query("INSERT INTO definitions (definition, word_id) VALUES ($1, $2)", [
      //       def.definition,
      //       wordId,
      //     ]);
      //   }
      // }
      await app.db.deleteFrom('definitions').where('word_id', '=', wordId).execute();
      for (let def of defs) {
        if (def.definition.length > 0) {
          await app.db.insertInto('definitions').values({
            definition: def.definition,
            word_id: wordId,
          }).execute();
        }
      }

      // await app.pg.query("DELETE FROM examples WHERE word_id = $1", [wordId]);
      // for (let ex of examples) {
      //   if (ex.example.length > 0) {
      //     await app.pg.query(
      //       "INSERT INTO examples (example, translation, word_id) VALUES($1, $2, $3)",
      //       [ex.example, ex.translation, wordId]
      //     );
      //   }
      // }
      await app.db.deleteFrom('examples').where('word_id', '=', wordId).execute();
      for (let ex of examples) {
        if (ex.example.length > 0) {
          await app.db.insertInto('examples').values({
            example: ex.example,
            translation: ex.translation,
            word_id: wordId,
          }).execute();
        }
      }


      // await app.pg.query("DELETE FROM conjugations WHERE word_id = $1", [wordId]);
      // for (let con of conjugations) {
      //   if (con.conjugation.length > 0) {
      //     await app.pg.query(
      //       "INSERT INTO conjugations (morfant, conjugation, translation, word_id) VALUES($1,$2,$3, $4)",
      //       [con.morfant, con.conjugation, con.translation, wordId]
      //     );
      //   }
      // }
      await app.db.deleteFrom('conjugations').where('word_id', '=', wordId).execute();
      for (let con of conjugations) {
        if (con.conjugation.length > 0) {
          await app.db.insertInto('conjugations').values({
            conjugation: con.conjugation,
            morfant: con.morfant,
            translation: con.translation,
            word_id: wordId,
          }).execute();
        }
      }

      // await app.pg.query("DELETE FROM wordtags WHERE word_id = $1", [wordId]);
      await app.db.deleteFrom('wordtags').where('word_id', '=', wordId).execute();
      await addTagsToWords(wordId, tags, app);

      return reply.code(200).send({
        status: "success",
        message: "Word has been updated",
      });
    } catch (error) {
      app.log.error(`Error updating word: ${getErrorMessage(error)}`);
      return reply.internalServerError('Internal Server Error');
    }
  });
}

export default routes;