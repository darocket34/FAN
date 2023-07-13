"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Events",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        venueId: {
          type: Sequelize.INTEGER,
          references: {
            model: "Venues",
            key: "id",
            // onDelete: 'CASCADE',
          },
        },
        groupId: {
          type: Sequelize.INTEGER,
          references: {
            model: "Groups",
            key: "id",
            // onDelete: 'CASCADE',
          },
        },
        name: {
          type: Sequelize.STRING,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        type: {
          type: Sequelize.ENUM("Online", "In person"),
        },
        capacity: {
          type: Sequelize.INTEGER,
        },
        price: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        startDate: {
          type: Sequelize.DATE,
        },
        endDate: {
          type: Sequelize.DATE,
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
    options.tableName = "Events";
    await queryInterface.dropTable(options);
  },
};
