const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  sequelize.define(
    "PriceHistory",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      branchId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      prodId: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
  );
};