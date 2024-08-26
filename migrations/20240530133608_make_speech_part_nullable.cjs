exports.up = function (knex) {
  return knex.schema.alterTable("words", function (table) {
    table.char("speech_part", 50).nullable().alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("words", function (table) {
    table.char("speech_part", 50).notNullable().alter();
  });
};
