const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Branch",
    {
      id: {
        type: DataTypes.UUID, // clave impredecible, versión 4
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      branchName: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      coordinates: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      openningHours: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      clossingHours: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      workingDays: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      linkFb: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      linkIg: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      linkTk: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    }, {
    paranoid: true, // Habilita eliminación suave
  });
};