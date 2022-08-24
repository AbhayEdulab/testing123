const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('lessons', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    icon: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    objective: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    dueDate: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00.000000"
    },
    lessonToDate: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00.000000"
    },
    instructions: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    videoLink: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    lastUpdated: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00.000000"
    }
  }, {
    sequelize,
    tableName: 'lessons',
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
        name: "les-cou-cid",
        using: "BTREE",
        fields: [
          { name: "courseId" },
        ]
      },
    ]
  });
};
