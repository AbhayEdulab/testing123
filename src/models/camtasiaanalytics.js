const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('camtasiaanalytics', {
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
    chapterId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'chapters',
        key: 'id'
      }
    },
    link: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    percent: {
      type: DataTypes.DECIMAL(50,0),
      allowNull: true
    },
    seconds: {
      type: DataTypes.DECIMAL(65,0),
      allowNull: true
    },
    duration: {
      type: DataTypes.DECIMAL(65,0),
      allowNull: true
    },
    linkName: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'camtasiaanalytics',
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
        name: "caman_use_uid",
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
      {
        name: "caman_cou_cid",
        using: "BTREE",
        fields: [
          { name: "courseId" },
        ]
      },
      {
        name: "caman_sem_sid",
        using: "BTREE",
        fields: [
          { name: "semesterId" },
        ]
      },
      {
        name: "caman_cha_chid",
        using: "BTREE",
        fields: [
          { name: "chapterId" },
        ]
      },
      {
        name: "caman_sub_subid",
        using: "BTREE",
        fields: [
          { name: "subjectId" },
        ]
      },
    ]
  });
};
