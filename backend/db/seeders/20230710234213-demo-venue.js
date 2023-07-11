"use strict";
const { Venue } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Venue.bulkCreate(
      [
        {
          address: "123 4th ave S",
          city: "Seattle",
          state: "WA",
          lat: 47.6062,
          lng: 122.3321,
        },
        {
          address: "456 7th ave N",
          city: "Portland",
          state: "OR",
          lat: 45.5152,
          lng: 122.6784,
        },
        {
          address: "891 0th ave W",
          city: "Boston",
          state: "MA",
          lat: 42.3601,
          lng: 71.0589,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Venues";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        address: {
          [Op.in]: ["123 4th ave S", "456 7th ave N", "891 0th ave W"],
        },
      },
      {}
    );
  },
};
