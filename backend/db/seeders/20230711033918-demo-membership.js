"use strict";
const { Membership } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}
const statuses = [
  {
    status: "active",
  },
  {
    status: "inactive",
  },
  {
    status: "pending",
  },
];
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Membership.bulkCreate([], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Membership";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        status: { [Op.in]: ["active", "inactive", "pending"] },
      },
      {}
    );
  },
};
