const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
   sequelize.define('Videogame', {
      id: {
         type: DataTypes.UUID, // clave impredecible, versión 4
         defaultValue: DataTypes.UUIDV4,
         primaryKey: true,
         allowNull: false,
      },
      name: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      description: {
         type: DataTypes.TEXT,
         allowNull: false,
      },
      image: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      released_date: {
         type: DataTypes.DATE,
         allowNull: false,
      },
      rating: {
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      OriginDB: {
         type: DataTypes.BOOLEAN,
         allowNull: false,
      },
   }, { timestamps: false });
};

