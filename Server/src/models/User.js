const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("User", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    userName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    notificationEmail: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    phoneNumber1: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    phoneNumber2: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    comission: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("superAdmin", "admin", "especialista"),
    },
    first: {
      type: DataTypes.ENUM("1", "0"),
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    paranoid: true,
  });
};