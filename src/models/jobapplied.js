const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('jobapplied', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    jobId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'joblist',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('Applied','Accepted','Rejected'),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'jobapplied',
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
        name: "joba_use_stu",
        using: "BTREE",
        fields: [
          { name: "studentId" },
        ]
      },
      {
        name: "joba_jobl_jobId",
        using: "BTREE",
        fields: [
          { name: "jobId" },
        ]
      },
    ]
  });
};
