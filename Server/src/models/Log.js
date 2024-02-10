const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Log", {
    nameCompany: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    dbName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    op: {
      type: DataTypes.ENUM("C", "R", "U", "D", ".", "L", "O"),
    },
    desc: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });
};