"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Users",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        firstName: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        lastName: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        username: {
          allowNull: false,
          type: Sequelize.STRING(30),
          unique: true,
        },
        email: {
          allowNull: false,
          type: Sequelize.STRING(256),
          unique: true,
        },
        hashedPassword: {
          allowNull: false,
          type: Sequelize.STRING.BINARY,
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
    options.tableName = "Users";
    return queryInterface.dropTable(options);
  },
};
