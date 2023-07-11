"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    static associate(models) {
      Venue.hasMany(models.Event, {
        foreignKey: "venueId",
        onDelete: "CASCADE",
      });
    }
  }
  Venue.init(
    {
      groupId: DataTypes.INTEGER,
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      state: DataTypes.STRING,
      lat: DataTypes.DECIMAL,
      lng: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: "Venue",
    }
  );
  return Venue;
};
