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
      Group.belongsTo(models.User, {
        foreignKey: "organizerId",
        onDelete: "CASCADE",
      });
    }
  }
  Group.init(
    {
      organizerId: DataTypes.INTEGER,
      name: {
        type: DataTypes.STRING(60),
        validate: {
          len: {
            args: [0, 60],
            msg: "Name must be 60 characters or less",
          },
        },
      },
      about: {
        type: DataTypes.TEXT,
        validate: {
          len: {
            args: [50, 5000],
            msg: "About must be 50 characters or more",
          },
        },
      },
      type: {
        type: DataTypes.ENUM("Online", "In person"),
        validate: {
          isIn: {
            args: [["Online", "In person"]],
            msg: "Type must be 'Online' or 'In person'",
          },
        },
      },
      private: {
        type: DataTypes.BOOLEAN,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "City is Required",
          },
        },
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "State is required'",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Group",
    }
  );
  return Group;
};
