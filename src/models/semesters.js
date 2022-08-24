const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('semesters', {
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
        model: 'courses',
        key: 'id'
      }
    },
    semesterName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    semesterStartDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    semesterEndDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    semesterStatus: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    semYear: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'semesters',
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
        name: "sem_cou_cid",
        using: "BTREE",
        fields: [
          { name: "courseId" },
        ]
      },
    ]
  });
};
