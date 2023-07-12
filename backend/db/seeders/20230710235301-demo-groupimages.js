"use strict";
const { GroupImage } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

// const images = [
//   {
//     groupId: 1,
//     url: "url1",
//     preview: true,
//   },
//   {
//     groupId: 2,
//     url: "url2",
//     preview: false,
//   },
//   {
//     groupId: 3,
//     url: "url3",
//     preview: true,
//   },
// ];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await GroupImage.bulkCreate(
      [
        {
          groupId: 1,
          url: "url1",
          preview: true,
        },
        {
          groupId: 2,
          url: "url2",
          preview: false,
        },
        {
          groupId: 3,
          url: "url3",
          preview: true,
        },
      ],
      { validate: true }
    );
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
