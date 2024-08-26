import { FastifyInstance } from "fastify";


export default async function addTagsToWords(wordId: number, tags: string[], fastify: FastifyInstance) {
  try {
    for (const tag of tags) {
      // const existResult = await fastify.pg.query(
      //   "SELECT EXISTS(SELECT 1 FROM tags WHERE tag = $1)",
      //   [tag]
      // );

      const existResult = await fastify.db
        .selectFrom('tags')
        .select((eb) => eb.exists(eb.selectFrom('tags').where('tag', '=', tag)).as('exists'))
        .executeTakeFirstOrThrow();




      console.log("EXISTS: ", existResult.exists);
      if (existResult.exists) {
        // const resultTagId = await fastify.pg.query("SELECT id FROM tags WHERE tag = $1", [tag]);
        const resultTagId = await fastify.db.selectFrom('tags').select('id').where('tag', '=', tag).executeTakeFirstOrThrow();
        const tagIdRes = resultTagId.id;
        // await fastify.pg.query("INSERT INTO wordtags(word_id, tag_id) VALUES($1, $2)", [
        //   wordId,
        //   tagIdRes,
        // ]);
        await fastify.db.insertInto('wordtags').values({ word_id: wordId, tag_id: tagIdRes }).execute();
        continue;
      }

      // const tagResult = await fastify.pg.query("INSERT INTO tags (tag) VALUES($1) RETURNING id", [
      //   tag,
      // ]);
      const tagResult = await fastify.db.insertInto('tags').values({ tag }).returning('id').executeTakeFirstOrThrow();
      const tagId = tagResult.id;

      // await fastify.pg.query("INSERT INTO wordtags (tag_id, word_id) VALUES($1, $2)", [
      //   tagId,
      //   wordId,
      // ]);
      await fastify.db.insertInto('wordtags').values({ tag_id: tagId, word_id: wordId }).execute();
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}


