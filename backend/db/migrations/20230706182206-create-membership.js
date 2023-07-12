"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Memberships", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
          onDelete: 'CASCADE',
        },
      },
      groupId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Groups",
          key: "id",
          onDelete: 'CASCADE',
        },
      },
      status: {
        type: Sequelize.ENUM("member", "co-host", "pending"),
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
    options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Memberships";
    await queryInterface.dropTable(options);
  },
};
