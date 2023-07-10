"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {
      Group.hasMany(models.Event, { foreignKey: "groupId" });
      Group.hasMany(models.Venue, { foreignKey: "groupId" });
      Group.hasMany(models.GroupImage, { foreignKey: "groupId" });
      Group.hasMany(models.Membership, { foreignKey: "groupId" });
    }
  }
  Group.init(
    {
      organizerId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      about: DataTypes.TEXT,
      type: DataTypes.ENUM,
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
