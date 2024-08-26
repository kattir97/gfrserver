exports.up = function (knex) {
  return knex.schema.alterTable("words", function (table) {
    // Add a nullable column called "comment"
    table.text("comment").nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("words", function (table) {
    // Drop the "comment" column if the migration needs to be rolled back
    table.dropColumn("comment");
  });
};
