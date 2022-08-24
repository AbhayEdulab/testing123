const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('supports', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    adminEmail: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    technicalEmail: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    otherEmail: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    contentEmail: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'supports',
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
