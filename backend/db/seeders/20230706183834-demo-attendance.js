"use strict";
const { Attendance } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}
// const statuses = [
//   {
//     eventId: 1,
//     userId: 1,
//     status: "active",
//   },
//   {
//     eventId: 2,
//     userId: 2,
//     status: "inactive",
//   },
//   {
//     eventId: 3,
//     userId: 3,
//     status: "pending",
//   },
// ];
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Attendance.bulkCreate(
      [
        {
          eventId: 1,
          userId: 1,
          status: "active",
        },
        {
          eventId: 2,
          userId: 2,
          status: "inactive",
        },
        {
          eventId: 3,
          userId: 3,
          status: "pending",
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Attendance";
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
