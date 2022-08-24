const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('casestudyaccesses', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
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
    divisionId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    batchId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'batchmasters',
        key: 'id'
      }
    },
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    assignmentId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    filePath: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    assignmentName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    dueDate: {
      type: DataTypes.DATE(6),
      allowNull: true,
      defaultValue: "CURRENT_TIMESTAMP(6)"
    },
    lessonToDate: {
      type: DataTypes.DATE(6),
      allowNull: true,
      defaultValue: "0000-00-00 00:00:00.000000"
    },
    typeOfAssignments: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    fileLength: {
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
    role: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    assignmentCreatedOn: {
      type: DataTypes.DATE(6),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'casestudyaccesses',
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
        name: "cas_use_uid",
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
      {
        name: "cas_use_tid",
        using: "BTREE",
        fields: [
          { name: "teacherId" },
        ]
      },
      {
        name: "cas_cou_cid",
        using: "BTREE",
        fields: [
          { name: "courseId" },
        ]
      },
      {
        name: "cas_bat_bid",
        using: "BTREE",
        fields: [
          { name: "batchId" },
        ]
      },
    ]
  });
};
