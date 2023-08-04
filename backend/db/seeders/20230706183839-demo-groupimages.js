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
          url: "https://th-thumbnailer.cdn-si-edu.com/xxsEGDng6hC_MEYtQkeP8H1YmzA=/fit-in/1600x0/filters:focal(2016x1517:2017x1518)/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer_public/1d/6c/1d6c9922-5c18-44b4-beff-2d5afde40c4b/picnic_grazing_table_with_picnic_in_background_credit_the_luxury_picnic_company.jpg",
          preview: true,
        },
        {
          groupId: 3,
          url: "https://wearecardinals.com/wp-content/uploads/2020/04/u1Re9qgMfM8d6kumlW85PS6s55jQh5fbdmppgQsP.jpeg",
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
