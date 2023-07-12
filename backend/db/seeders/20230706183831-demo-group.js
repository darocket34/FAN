"use strict";
const { Group } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Group.bulkCreate(
      [
        {
          organizerId: 1,
          name: "Tech-Hooligans",
          about:
            "A group of nerds looking for a good time blah blah blah blah blah blah blah blah",
          type: "Online",
          private: false,
          city: "San Francisco",
          state: "CA",
        },
        {
          organizerId: 2,
          name: "Lovers and Friends",
          about:
            "Locals looking for love and new relationships blah blah blah blah blah blah blah blah",
          type: "Online",
          private: true,
          city: "Seattle",
          state: "WA",
        },
        {
          organizerId: 3,
          name: "Exploration Station",
          about:
            "Wilderness experts expanding outdoorsy knowledge blah blah blah blah blah blah blah blah",
          type: "In person",
          private: false,
          city: "Dallas",
          state: "TX",
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Groups";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        name: {
          [Op.in]: [
            "Tech-Hooligans",
            "Lovers and Friends",
            "Exploration Station",
          ],
        },
      },
      {}
    );
  },
};
