const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('teachereducationaldetails', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    qualification: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    graduation: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    masters: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    otherDegree: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    phd: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'teachereducationaldetails',
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
      {
        name: "ted_use_uid",
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
    ]
  });
};
