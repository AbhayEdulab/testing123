const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bloguploads', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    blogId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'blogs',
        key: 'id'
      }
    },
    filePath: {
      type: DataTypes.INTEGER,
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
    },
    uploadedAt: {
      type: DataTypes.DATE(6),
      allowNull: true,
      defaultValue: "0000-00-00 00:00:00.000000"
    }
  }, {
    sequelize,
    tableName: 'bloguploads',
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
        name: "bloup_blo_blid",
        using: "BTREE",
        fields: [
          { name: "blogId" },
        ]
      },
    ]
  });
};
