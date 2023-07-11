"use strict";
const { Event } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Event.bulkCreate(
      [
        {
          venueId: 1,
          groupId: 1,
          name: "Ice Cream Social",
          description: "Fun get together with delicious frozen treats",
          type: "Networking",
          capacity: 25,
          price: 24,
          startDate: "2023-08-15",
          endDate: "2023-08-15",
        },
        {
          venueId: 2,
          groupId: 2,
          name: "Wilderness Exploration",
          description: "Camp with total strangers and find out who is a creep",
          type: "Fun",
          capacity: 12,
          price: 40,
          startDate: "2023-08-21",
          endDate: "2023-08-28",
        },
        {
          venueId: 3,
          groupId: 3,
          name: "Speed Dating on the Pier",
          description: "Get to know some other folks on FAN",
          type: "Romance",
          capacity: 18,
          price: 20,
          startDate: "2023-08-18",
          endDate: "2023-08-18",
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Events";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        name: {
          [Op.in]: [
            "Ice Cream Social",
            "Wilderness Exploration",
            "Speed Dating on the Pier",
          ],
        },
      },
      {}
    );
  },
};
