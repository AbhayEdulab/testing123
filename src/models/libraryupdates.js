const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('libraryupdates', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    topicLibId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'topiclibraries',
        key: 'id'
      }
    },
    updateType: {
      type: DataTypes.CHAR(255),
      allowNull: true
    },
    description: {
      type: DataTypes.CHAR(255),
      allowNull: true
    },
    name: {
      type: DataTypes.CHAR(255),
      allowNull: true
    },
    topicName: {
      type: DataTypes.CHAR(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'libraryupdates',
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
        name: "lup_tol_tlid",
        using: "BTREE",
        fields: [
          { name: "topicLibId" },
        ]
      },
    ]
  });
};
