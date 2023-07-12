"use strict";
const { Membership } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Membership.bulkCreate(
      [
        {
          userId: 1,
          groupId: 1,
          status: "co-host",
        },
        {
          userId: 2,
          groupId: 2,
          status: "member",
        },
        {
          userId: 3,
          groupId: 1,
          status: "pending",
        },
        {
          userId: 4,
          groupId: 1,
          status: "member",
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Memberships";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        id: { [Op.in]: [1, 2, 3, 4] },
      },
      {}
    );
  },
};
