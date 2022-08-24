const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('studentanalytics', {
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
    homeComponent: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    forumComponent: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    assignmentComponent: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    scheduleComponent: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    submissionComponent: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    chatComponent: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    libraryComponent: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    chapterComponent: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    lessonComponent: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    attendanceComponent: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    settingsComponent: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    userName: {
      type: DataTypes.DATE(6),
      allowNull: true
    },
    analyticDate: {
      type: DataTypes.DATE(6),
      allowNull: true
    },
    clientType: {
      type: DataTypes.DATE(6),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'studentanalytics',
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
        name: "sta_use_uid",
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
    ]
  });
};
