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
    console.log("FROM FULL TEXT:", searchTerm)
    let results = await db
      .selectFrom('words as w')
      .leftJoin('definitions as d', 'w.id', 'd.word_id')
      .leftJoin('examples as e', 'w.id', 'e.word_id')
      .leftJoin('conjugations as c', 'w.id', 'c.word_id')
      .where((eb) =>
        eb.or([
          eb('w.textsearchable_index_col', '@@', sql<any>`to_tsquery('simple', ${searchTerm})`),
          eb('d.textsearchable_index_col', '@@', sql<any>`to_tsquery('simple', ${searchTerm})`),
          eb('e.textsearchable_index_col', '@@', sql<any>`to_tsquery('simple', ${searchTerm})`),
          eb('c.textsearchable_index_col', '@@', sql<any>`to_tsquery('simple', ${searchTerm})`),
        ])).
      groupBy('w.id')
      .select([
        'w.id',
        // 'w.word',
        // sql`array_agg(DISTINCT d.definition)`.as('definitions'),
        // sql`array_agg(DISTINCT e.example)`.as('examples'),
        // sql`array_agg(DISTINCT e.translation)`.as('example_translations'),
        // sql`array_agg(DISTINCT c.morfant)`.as('morfant'),
        // sql`array_agg(DISTINCT c.conjugation)`.as('conjugations'),
        // sql`array_agg(DISTINCT c.translation)`.as('conjugation_translations'),
      ])
      .execute();

    if (results.length === 0) {
      results = await db
        .selectFrom('words as w')
        .leftJoin('definitions as d', 'w.id', 'd.word_id')
        .leftJoin('examples as e', 'w.id', 'e.word_id')
        .leftJoin('conjugations as c', 'w.id', 'c.word_id')
        .where((eb) => eb.or([
          eb('w.word', 'ilike', `%${searchTerm}%`),
          eb('d.definition', 'ilike', `%${searchTerm}%`),
          eb('e.example', 'ilike', `%${searchTerm}%`),
          eb('c.conjugation', 'ilike', `%${searchTerm}%`),
        ]))
        .groupBy('w.id')
        .select([
          'w.id',
        ])
        .execute();
    }

    const ids = results.map((obj) => obj.id);

    const words = []

    for (let id of ids) {
      const res = await getWordData(db, id);
      words.push(res);
    }

    return words;
  });
}

export default routes;