const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('rooms', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name1: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    name2: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    members: {
      type: DataTypes.JSON,
      allowNull: true
    },
    lastActive: {
      type: DataTypes.DATE(6),
      allowNull: true,
      defaultValue: "CURRENT_TIMESTAMP(6)"
    },
    roomCreatedOn: {
      type: DataTypes.DATE(6),
      allowNull: true
    },
    roomName: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'rooms',
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
