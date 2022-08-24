const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('unapprovedsyllabuses', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    syllabusFilesId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'syllabusfiles',
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
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
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
    subjects: {
      type: DataTypes.CHAR(255),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    approval: {
      type: DataTypes.CHAR(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'unapprovedsyllabuses',
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
        name: "uas_syf_sid",
        using: "BTREE",
        fields: [
          { name: "syllabusFilesId" },
        ]
      },
      {
        name: "uas_cou_cid",
        using: "BTREE",
        fields: [
          { name: "courseId" },
        ]
      },
      {
        name: "uas_use_tid",
        using: "BTREE",
        fields: [
          { name: "teacherId" },
        ]
      },
      {
        name: "uas_sem_sid",
        using: "BTREE",
        fields: [
          { name: "semesterId" },
        ]
      },
    ]
  });
};
