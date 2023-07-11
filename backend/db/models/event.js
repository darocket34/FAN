"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      Event.hasMany(models.EventImage, {
        foreignKey: "eventId",
        onDelete: "CASCADE",
      });
      Event.hasMany(models.Attendance, {
        foreignKey: "eventId",
        onDelete: "CASCADE",
      });
    }
  }
  Event.init(
    {
      venueId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      groupId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      type: DataTypes.ENUM("Networking", "Fun", "Romance"),
      capacity: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Event",
    }
  );
  return Event;
};
