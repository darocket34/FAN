"use strict";
const { EventImage } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await EventImage.bulkCreate(
      [
        {
          eventId: 1,
          url: "https://i.imgur.com/QlSgcKC.gif",
          preview: true,
        },
        {
          eventId: 2,
          url: "https://cdn.britannica.com/36/162636-050-932C5D49/Colosseum-Rome-Italy.jpg",
          preview: true,
        },
        {
          eventId: 3,
          url: "https://i.imgur.com/mBEM1Pw.jpeg",
          preview: true,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "EventImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        url: { [Op.in]: ["url10", "url11", "url12"] },
      },
      {}
    );
  },
};
