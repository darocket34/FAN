"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Membership.belongsTo(models.Group, {
        foreignKey: "groupId",
        onDelete: "CASCADE",
        hooks: true
      });
    }
  }
  Membership.init(
    {
      userId: DataTypes.INTEGER,
      groupId: DataTypes.INTEGER,
      status: DataTypes.ENUM("member", "co-host", "pending"),
    },
    {
      sequelize,
      modelName: "Membership",
    }
  );
  return Membership;
};
