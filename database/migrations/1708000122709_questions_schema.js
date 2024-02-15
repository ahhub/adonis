"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class QuestionsSchema extends Schema {
  up() {
    this.create("questions", (table) => {
      table.increments();
      table.timestamps();
      table.string("question");
      table.string("option_a");
      table.string("option_b");
      table.string("option_c");
      table.string("option_d");
      table.string("answer_option");
      table.string("answer");
    });
  }

  down() {
    this.drop("questions");
  }
}

module.exports = QuestionsSchema;
