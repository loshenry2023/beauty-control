const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Calendar", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    date_from: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    date_to: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    obs: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    current: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    reminded: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    paranoid: true,
  });
};