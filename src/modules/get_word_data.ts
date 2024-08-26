import { Kysely } from "kysely";
import { DB } from "kysely-codegen";

export const getWordData = async (db: Kysely<DB>, wordId: number) => {
  try {
    // Retrieve the word
    const word = await db.selectFrom('words').selectAll().where('id', '=', wordId).executeTakeFirst();

    // Retrieve the definitions
    const defs = await db.selectFrom('definitions').selectAll().where('word_id', '=', wordId).execute();

    // Retrieve the examples
    const examples = await db.selectFrom('examples').selectAll().where('word_id', '=', wordId).execute();

    // Retrieve the conjugations
    const conjugations = await db.selectFrom('conjugations').selectAll().where('word_id', '=', wordId).execute();

    // Retrieve the tags
    const tags = await db.selectFrom('tags')
      .innerJoin('wordtags', 'wordtags.tag_id', 'tags.id')
      .select(['tags.tag', 'wordtags.word_id'])
      .where('wordtags.word_id', '=', wordId)  // Ensure only relevant tags are fetched
      .execute();

    // Process the retrieved data
    const defsArr = defs.map((def) => def.definition);
    const examplesArr = examples.map((ex) => ({
      example: ex.example,
      translation: ex.translation,
    }));
    const conjArr = conjugations.map((con) => ({
      morfant: con.morfant,
      conjugation: con.conjugation,
      translation: con.translation,
    }));
    const tagsArr = tags.map((tag) => tag.tag);

    // Combine the data into a single structure
    return {
      ...word,
      definitions: defsArr,
      examples: examplesArr,
      conjugations: conjArr,
      tags: tagsArr,
    };
  } catch (error: any) {
    throw new Error(`Error retrieving word data: ${error.message}`);
  }
}
