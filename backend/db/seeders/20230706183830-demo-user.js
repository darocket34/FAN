"use strict";
const { User } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate(
      [
        {
          firstName: "Userone",
          lastName: "lastname",
          email: "demo@user.io",
          username: "FakeUser1",
          hashedPassword: bcrypt.hashSync("password1"),
        },
        {
          firstName: "Usertwo",
          lastName: "lastname",
          email: "user2@user.io",
          username: "FakeUser2",
          hashedPassword: bcrypt.hashSync("password2"),
        },
        {
          firstName: "Userthree",
          lastName: "lastname",
          email: "user3@user.io",
          username: "FakeUser3",
          hashedPassword: bcrypt.hashSync("password3"),
        },
        {
          firstName: "Userfour",
          lastName: "lastname",
          email: "user4@user.io",
          username: "FakeUser4",
          hashedPassword: bcrypt.hashSync("password4"),
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        id: { [Op.in]: [1, 2, 3, 4] },
      },
      {}
    );
  },
};
