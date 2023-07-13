"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Attendance.belongsTo(models.Event, {
        foreignKey: "eventId",
        onDelete: "CASCADE",
        // hooks: true,
      });
    }
  }
  Attendance.init(
    {
      eventId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Event",
          key: "id",
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "id",
        },
      },
      status: DataTypes.ENUM("attending", "waitlist", "pending"),
    },
    {
      sequelize,
      modelName: "Attendance",
    }
  );
  return Attendance;
};
