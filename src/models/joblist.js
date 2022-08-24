const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('joblist', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    addedById: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    companyName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    jobTitle: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    websiteLink: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    jobDescription: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    packageRange: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'joblist',
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
        name: "jli_add_use",
        using: "BTREE",
        fields: [
          { name: "addedById" },
        ]
      },
    ]
  });
};
