"use strict";
const { EventImage } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}
/** @type {import('sequelize-cli').Migration} */

const images = [
  {
    url: "url10",
    preview: true,
  },
  {
    url: "url11",
    preview: false,
  },
  {
    url: "url12",
    preview: true,
  },
];
module.exports = {
  async up(queryInterface, Sequelize) {
    await EventImage.bulkCreate([], { validate: true });
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
