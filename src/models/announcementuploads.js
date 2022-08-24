const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('announcementuploads', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    announcementId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'announcements',
        key: 'id'
      }
    },
    filePath: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    length: {
      type: DataTypes.STRING(255),
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
    tableName: 'announcementuploads',
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
        name: "annup_ann_annid",
        using: "BTREE",
        fields: [
          { name: "announcementId" },
        ]
      },
    ]
  });
};
