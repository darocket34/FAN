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
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Restaurant_N%C3%A4sinneula.jpg/1280px-Restaurant_N%C3%A4sinneula.jpg",
          preview: true,
        },
        {
          eventId: 2,
          url: "https://cdn.britannica.com/36/162636-050-932C5D49/Colosseum-Rome-Italy.jpg",
          preview: true,
        },
        {
          eventId: 3,
          url: "https://www.phoenix.edu/blog/2023/03/programmer-vs-software-engineer-key-differences/_jcr_content/root/container_14213/columns/responsivegrid1/container/container_copy/image_1151727092.coreimg.85.1200.jpeg/1679007029729/male-programmer-writing-code-in-modern-office-704x421.jpeg",
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
