const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('questions', {
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
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'courses',
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
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'subject',
        key: 'id'
      }
    },
    question: {
      type: DataTypes.CHAR(255),
      allowNull: true
    },
    viewCount: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'questions',
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
        name: "que_use_uid",
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
      {
        name: "que_cou_cid",
        using: "BTREE",
        fields: [
          { name: "courseId" },
        ]
      },
      {
        name: "que_sem_sid",
        using: "BTREE",
        fields: [
          { name: "semesterId" },
        ]
      },
      {
        name: "que_sub_subid",
        using: "BTREE",
        fields: [
          { name: "subjectId" },
        ]
      },
    ]
  });
};
