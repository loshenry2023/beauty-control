const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Incoming", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    paymentMethodName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    DateIncoming: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
};