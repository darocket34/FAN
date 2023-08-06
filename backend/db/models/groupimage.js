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
      });
    }
  }
  GroupImage.init(
    {
      groupId: {
        type: DataTypes.INTEGER,
      },
      url: DataTypes.STRING(255),
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
