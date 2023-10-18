"use strict";
const { GroupImage } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await GroupImage.bulkCreate(
      [
        {
          groupId: 1,
          url: "https://i.imgur.com/ye8yURO.jpeg",
          preview: true,
        },
        {
          groupId: 2,
          url: "https://i.imgur.com/FYjtABS.jpeg",
          preview: true,
        },
        {
          groupId: 3,
          url: "https://i.imgur.com/Kg28YXn.jpeg",
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
