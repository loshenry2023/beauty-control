const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Company", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    userName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    dbName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    nameCompany: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imgCompany: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    subscribedPlan: {
      type: DataTypes.ENUM("básico", "none"),
    },
    firstLogin: {
      type: DataTypes.ENUM("1", "0"),
    },
    expireAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    lastUse: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });
};