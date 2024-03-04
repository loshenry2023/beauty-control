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
        // C: create
        // U: update
        // D: delete
        // .: generic (backup, restore, depuraciones,inicio del programa)
        // L: login
        // O: logout
        // S: send mail
        op: {
            type: DataTypes.ENUM("C", "U", "D", ".", "L", "O", "S"),
        },
        desc: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    });
};