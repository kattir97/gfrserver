import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { QueryString } from "../../../schemas/word/params.js";
import { normalizeQuery } from "../../../utils/normalizeQuery.js";
import { sql } from "kysely";
import { getWordData } from "../../../modules/get_word_data.js";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.get('/full-text-search', { schema: { querystring: QueryString } }, async (req, res) => {
    const query = req.query.query;
    const searchTerm = normalizeQuery(query);
    const { db } = app;



    let results = await db
      .selectFrom('words as w')
      .leftJoin('definitions as d', 'w.id', 'd.word_id')
      .leftJoin('examples as e', 'w.id', 'e.word_id')
      .leftJoin('conjugations as c', 'w.id', 'c.word_id')
      .where((eb) =>
        eb.or([
          eb('w.textsearchable_index_col', '@@', sql<any>`plainto_tsquery('simple', ${searchTerm})`),
          eb('d.textsearchable_index_col', '@@', sql<any>`plainto_tsquery('simple', ${searchTerm})`),
          // eb('e.textsearchable_index_col', '@@', sql<any>`plainto_tsquery('simple', ${searchTerm})`),
          // eb('c.textsearchable_index_col', '@@', sql<any>`plainto_tsquery('simple', ${searchTerm})`),
        ])).
      groupBy('w.id')
      .select([
        'w.id',
      ])
      .execute();

    const ids = results.map((obj) => obj.id);

    // Check if no word IDs were found
    if (ids.length === 0) {
      return [];  // Return empty result if no matching word IDs found
    }

    return await getWordData(db, ids)
  });
}

export default routes;