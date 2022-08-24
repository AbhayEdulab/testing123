const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bbbinfos', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    moderatorUrl: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    attendeeUrl: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    meetingEndUrl: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    meetingName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    TeacherName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    upadetedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'bbbinfos',
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
        name: "bbb_use_tid",
        using: "BTREE",
        fields: [
          { name: "teacherId" },
        ]
      },
    ]
  });
};
