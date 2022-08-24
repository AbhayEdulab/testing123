const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('webinaruploads', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    webinarId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'webinars',
        key: 'id'
      }
    },
    filePath: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    length: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'webinaruploads',
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
        name: "wup_web_wid",
        using: "BTREE",
        fields: [
          { name: "webinarId" },
        ]
      },
    ]
  });
};
