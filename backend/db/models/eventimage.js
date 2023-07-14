"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EventImage extends Model {
    static associate(models) {
      EventImage.belongsTo(models.Event, {
        foreignKey: "eventId",
        // onDelete: "CASCADE",
        // hooks: true,
      });
    }
  }
  EventImage.init(
    {
      eventId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Event",
          key: "id",
        },
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      preview: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "EventImage",
    }
  );
  return EventImage;
};
