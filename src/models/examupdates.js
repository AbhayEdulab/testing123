const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('examupdates', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'departments',
        key: 'id'
      }
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'courses',
        key: 'id'
      }
    },
    batchId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'batchmasters',
        key: 'id'
      }
    },
    semesterId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'semesters',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    studentArray: {
      type: DataTypes.JSON,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'examupdates',
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
        name: "dep_exu_dep",
        using: "BTREE",
        fields: [
          { name: "departmentId" },
        ]
      },
      {
        name: "cou_exu_cou",
        using: "BTREE",
        fields: [
          { name: "courseId" },
        ]
      },
      {
        name: "bat_exu_bat",
        using: "BTREE",
        fields: [
          { name: "batchId" },
        ]
      },
      {
        name: "sem_exu_sem",
        using: "BTREE",
        fields: [
          { name: "semesterId" },
        ]
      },
    ]
  });
};
