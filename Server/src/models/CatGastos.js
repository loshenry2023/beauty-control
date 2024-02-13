const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "CatGastos",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      catName: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    }, {
    paranoid: true,
  });
};