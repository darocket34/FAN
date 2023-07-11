"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {
      Group.hasMany(models.Event, {
        foreignKey: "groupId",
        onDelete: "CASCADE",
      });
      Group.hasMany(models.Venue, {
        foreignKey: "groupId",
        onDelete: "CASCADE",
      });
      Group.hasMany(models.GroupImage, {
        foreignKey: "groupId",
        onDelete: "CASCADE",
      });
      Group.hasMany(models.Membership, {
        foreignKey: "groupId",
        onDelete: "CASCADE",
      });
    }
  }
  Group.init(
    {
      organizerId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      about: DataTypes.TEXT,
      type: DataTypes.ENUM("Networking", "Fun", "Romance"),
      private: DataTypes.BOOLEAN,
      city: DataTypes.STRING,
      state: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Group",
    }
  );
  return Group;
};
