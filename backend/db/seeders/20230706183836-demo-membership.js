"use strict";
const { Membership } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}
// const statuses = [
//   {
//     userId: 1,
//     groupId: 1,
//     status: "active",
//   },
//   {
//     userId: 2,
//     groupId: 2,
//     status: "inactive",
//   },
//   {
//     userId: 3,
//     groupId: 3,
//     status: "pending",
//   },
// ];
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Membership.bulkCreate([{
      userId: 1,
      groupId: 1,
      status: "active",
    },
    {
      userId: 2,
      groupId: 2,
      status: "inactive",
    },
    {
      userId: 3,
      groupId: 3,
      status: "pending",
    },], { validate: true });
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
