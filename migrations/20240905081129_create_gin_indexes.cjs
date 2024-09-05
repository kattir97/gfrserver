exports.up = async function (knex) {
  // Create GIN index for the first table
  await knex.raw(
    "CREATE INDEX idx_textsearchable_words ON words USING GIN (textsearchable_index_col);"
  );

  // Create GIN index for the second table
  await knex.raw(
    "CREATE INDEX idx_textsearchable_defs ON definitions USING GIN (textsearchable_index_col);"
  );

  // Create GIN index for the third table
  await knex.raw(
    "CREATE INDEX idx_textsearchable_exs ON examples USING GIN (textsearchable_index_col);"
  );

  // Create GIN index for the fourth table
  await knex.raw(
    "CREATE INDEX idx_textsearchable_cjs ON conjugations USING GIN (textsearchable_index_col);"
  );
};

exports.down = async function (knex) {
  // Drop GIN index for the first table
  await knex.raw("DROP INDEX IF EXISTS idx_textsearchable_words;");

  // Drop GIN index for the second table
  await knex.raw("DROP INDEX IF EXISTS idx_textsearchable_defs;");

  // Drop GIN index for the third table
  await knex.raw("DROP INDEX IF EXISTS idx_textsearchable_exs;");

  // Drop GIN index for the fourth table
  await knex.raw("DROP INDEX IF EXISTS idx_textsearchable_cjs;");
};
