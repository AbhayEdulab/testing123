const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('uploadedassignments', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    assignmentId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    length: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fileName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    assignmentName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    marksObtained: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    uploaded: {
      type: DataTypes.ENUM('true','false'),
      allowNull: true,
      defaultValue: "false"
    },
    viewStatus: {
      type: DataTypes.ENUM('true','false'),
      allowNull: true,
      defaultValue: "false"
    },
    submitted: {
      type: DataTypes.ENUM('true','false'),
      allowNull: true,
      defaultValue: "false"
    },
    feedback: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'uploadedassignments',
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
        name: "upa_use_uid",
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
    ]
  });
};
