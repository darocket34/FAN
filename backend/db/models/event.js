"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      Event.hasMany(models.EventImage, {
        foreignKey: "eventId",
        onDelete: "CASCADE",
        hooks: true,
      });
      Event.hasMany(models.Attendance, {
        foreignKey: "eventId",
        onDelete: "CASCADE",
        hooks: true,
      });
      Event.belongsTo(models.Group, {
        foreignKey: "groupId",
        // onDelete: "CASCADE",
        // hooks: true,
      });
      Event.belongsTo(models.Venue, {
        foreignKey: "venueId",
        // onDelete: "CASCADE",
        // hooks: true,
      });
    }
  }
  Event.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      venueId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Venue',
          key: 'id'
        }
      },
      groupId: DataTypes.INTEGER,
      name: {
        type: DataTypes.STRING,
        validate: {
          len: [5, 100],
        },
        references: {
          model: 'Group',
          key: 'id'
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("Online", "In person"),
      },
      capacity: DataTypes.INTEGER,
      price: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
      },
      endDate: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Event",
    }
  );
  return Event;
};
