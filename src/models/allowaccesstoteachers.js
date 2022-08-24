const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('allowaccesstoteachers', {
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
    pptNotes: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    practiseQuestion: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    prerequisite: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    onlineLecture: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    quiz: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    syllabusObjectives: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    vimeoLink: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'allowaccesstoteachers',
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
        name: "aatt_use_tid",
        using: "BTREE",
        fields: [
          { name: "teacherId" },
        ]
      },
    ]
  });
};
