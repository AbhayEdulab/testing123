const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cohorttimetable', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    cohortId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'cohort',
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
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
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
    cohortTeacherId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'cohortteacher',
        key: 'id'
      }
    },
    semesterName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    cohortName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    teacherName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    date: {
      type: DataTypes.DATE(6),
      allowNull: true
    },
    fromTime: {
      type: DataTypes.TIME,
      allowNull: true
    },
    toTime: {
      type: DataTypes.TIME,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    approval: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    playbackLink: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'cohorttimetable',
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
        name: "cti_cht_chid",
        using: "BTREE",
        fields: [
          { name: "cohortId" },
        ]
      },
      {
        name: "cti_sem_sid",
        using: "BTREE",
        fields: [
          { name: "semesterId" },
        ]
      },
      {
        name: "cti_ctea_teid",
        using: "BTREE",
        fields: [
          { name: "cohortTeacherId" },
        ]
      },
      {
        name: "cti_tea_tid",
        using: "BTREE",
        fields: [
          { name: "teacherId" },
        ]
      },
      {
        name: "cti_sub_subid",
        using: "BTREE",
        fields: [
          { name: "subjectId" },
        ]
      },
    ]
  });
};
