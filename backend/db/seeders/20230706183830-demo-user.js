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
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          username: "john_doe",
          hashedPassword: bcrypt.hashSync("password1"),
        },
        {
          firstName: "Jane",
          lastName: "Smith",
          email: "jane.smith@example.com",
          username: "jane_smith",
          hashedPassword: bcrypt.hashSync("password2"),
        },
        {
          firstName: "Michael",
          lastName: "Johnson",
          email: "michael.johnson@example.com",
          username: "michael_johnson",
          hashedPassword: bcrypt.hashSync("password3"),
        },
        {
          firstName: "Emily",
          lastName: "Brown",
          email: "emily.brown@example.com",
          username: "emily_brown",
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
