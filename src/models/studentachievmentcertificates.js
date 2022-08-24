const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('studentachievmentcertificates', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    fileType: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    documentName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    documentCategory: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    curriculumName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    achievementName: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'studentachievmentcertificates',
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
        name: "sac_use_stuId",
        using: "BTREE",
        fields: [
          { name: "studentId" },
        ]
      },
    ]
  });
};
