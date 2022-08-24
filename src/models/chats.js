const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('chats', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    roomId:  {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    msgFrom: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    msgTo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    msg: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'chats',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
