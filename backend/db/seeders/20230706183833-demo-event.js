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
          name: "Summer Social",
          description:
            "Join us for a fun get together with delicious frozen treats and great company.",
          type: "In Person",
          capacity: 30,
          price: 15,
          startDate: new Date("2023-09-01 05:28:00 GMT-0700").toString(),
          endDate: new Date("2023-09-01 08:00:00 GMT-0700").toString(),
        },
        {
          venueId: 2,
          groupId: 2,
          name: "Hiking Adventure",
          description:
            "Embark on an exciting hiking adventure with total strangers and make new friends along the way.",
          type: "In Person",
          capacity: 20,
          price: 25,
          startDate: new Date("2023-09-10 09:00:00 GMT-0700").toString(),
          endDate: new Date("2023-09-10 15:00:00 GMT-0700").toString(),
        },
        {
          venueId: 3,
          groupId: 3,
          name: "Virtual Meetup",
          description:
            "Connect with like-minded individuals in this online meetup and have meaningful conversations.",
          type: "Online",
          capacity: 50,
          price: 0,
          startDate: new Date("2023-09-05 18:30:00 GMT-0700").toString(),
          endDate: new Date("2023-09-05 21:00:00 GMT-0700").toString(),
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
        id: {
          [Op.in]: [1, 2, 3],
        },
      },
      {}
    );
  },
};
