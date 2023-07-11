"use strict";
const { GroupImage } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const images = [
  {
    url: "url1",
    preview: true,
  },
  {
    url: "url2",
    preview: false,
  },
  {
    url: "url3",
    preview: true,
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    for (let image of images) {
    }
    await GroupImage.bulkCreate([], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "GroupImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        url: { [Op.in]: ["url1", "url2", "url3"] },
      },
      {}
    );
  },
};
