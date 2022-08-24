const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('studentresult', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    batchId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    semesterId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fileName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    profile: {
      type: DataTypes.JSON,
      allowNull: true
    },
    subjects: {
      type: DataTypes.JSON,
      allowNull: true
    },
    semesters: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'studentresult',
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
