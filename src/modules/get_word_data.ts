import { Kysely } from "kysely";
import { DB } from "kysely-codegen";

export const getWordData = async (db: Kysely<DB>, ids: number[]) => {
  try {
    // Step 2: Batch query all related data
    const words = await db
      .selectFrom('words as w')
      .leftJoin('definitions as d', 'w.id', 'd.word_id')
      .leftJoin('examples as e', 'w.id', 'e.word_id')
      .leftJoin('conjugations as c', 'w.id', 'c.word_id')
      .leftJoin('wordtags as wt', 'w.id', 'wt.word_id')
      .leftJoin('tags as t', 't.id', 'wt.tag_id')
      .where('w.id', 'in', ids)
      .selectAll('w')
      .select([
        'd.definition',
        'e.example',
        'e.translation as example_translation',
        'c.morfant',
        'c.conjugation',
        'c.translation as conjugation_translation',
        't.tag as tag_name',
      ])
      .execute();

    console.log('words', words)

    // Step 3: Process and de-duplicate the results
    const wordMap: Record<number, any> = {};

    for (const row of words) {
      const wordId = row.id;

      // Initialize the word entry if it doesn't exist
      if (!wordMap[wordId]) {
        wordMap[wordId] = {
          ...row,
          definitions: new Set(),   // Use Set to avoid duplicates
          examples: new Set(),
          conjugations: new Set(),
          tags: new Set(),
        };
      }

      // Add definition if it exists
      if (row.definition) {
        wordMap[wordId].definitions.add(row.definition);
      }

      // Add example if it exists
      if (row.example) {
        wordMap[wordId].examples.add(JSON.stringify({
          example: row.example,
          translation: row.example_translation,
        })); // Use JSON.stringify to ensure unique objects
      }

      // Add conjugation if it exists
      if (row.conjugation) {
        wordMap[wordId].conjugations.add(JSON.stringify({
          morfant: row.morfant,
          conjugation: row.conjugation,
          translation: row.conjugation_translation,
        }));
      }

      // Add tag if it exists
      if (row.tag_name) {
        wordMap[wordId].tags.add(row.tag_name);
      }
    }


    // Step 4: Convert sets to arrays and return the results
    const result = Object.values(wordMap).map((word) => ({
      ...word,
      definitions: Array.from(word.definitions),
      examples: Array.from(word.examples).map((example: string) => JSON.parse(example)),
      conjugations: Array.from(word.conjugations).map((conjugation: string) => JSON.parse(conjugation)),
      tags: Array.from(word.tags),
    }));


    console.log('result', result)
    return result;
  } catch (error: any) {
    throw new Error(`Error retrieving word data: ${error.message}`);
  }
}
