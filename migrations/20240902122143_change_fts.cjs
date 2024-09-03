exports.up = function (knex) {
  return knex.schema.table("conjugations", function (table) {
    // Drop the existing column
    table.dropColumn("textsearchable_index_col");
  });
};

exports.down = function (knex) {
  return knex.schema.table("conjugations", function (table) {
    // Re-add the column with the original definition
    table.specificType(
      "textsearchable_index_col",
      "tsvector GENERATED ALWAYS AS (to_tsvector('simple', coalesce(conjugation, '') || ' ' || coalesce(translation, '') || ' ' || coalesce(morfant, ''))) STORED"
    );
  });
};
