"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class GroupImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      GroupImage.belongsTo(models.Group, {
        foreignKey: "groupId",
        // onDelete: "CASCADE",
        // hooks: true
      });
    }
  }
  GroupImage.init(
    {
      groupId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Groups",
          // onDelete: "CASCADE",
        },
      },
      url: DataTypes.STRING,
      preview: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      defaultScope: {
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      modelName: "GroupImage",
    }
  );
  return GroupImage;
};
