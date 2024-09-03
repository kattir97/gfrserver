exports.up = function (knex) {
  return knex.schema.table("words", function (table) {
    // Add the new column with the desired language configuration
    table.specificType(
      "textsearchable_index_col",
      "tsvector GENERATED ALWAYS AS (to_tsvector('simple', coalesce(word, ''))) STORED"
    );
  });
};

exports.down = function (knex) {
  return knex.schema.table("words", function (table) {
    // Drop the existing column
    table.dropColumn("textsearchable_index_col");
  });
};
