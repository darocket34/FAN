"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "GroupImages",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        groupId: {
          type: Sequelize.INTEGER,
          references: {
            model: "Groups",
            key: "id",
            // onDelete: "CASCADE",
          },
        },
        url: {
          type: Sequelize.STRING,
        },
        preview: {
          type: Sequelize.BOOLEAN,
        },
        createdAt: {
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          type: Sequelize.DATE,
        },
      },
      options
    );
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "GroupImages";
    await queryInterface.dropTable(options);
  },
};