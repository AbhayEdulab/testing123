const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('studentfeedback', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    questionId: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    semesterId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    batchId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    subject:{
      type: DataTypes.STRING(255),
      allowNull: true
    },
    feedback : {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Comment : {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Complete : {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'studentfeedback',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      }, {
          name: "sfb_use_stuId",
          using: "BTREE",
          fields: [
            { name: "studentId" },
          ]
        }, {
          name: "sfb_use_tId",
          using: "BTREE",
          fields: [
            { name: "teacherId" },
          ]
        },{
          name: "sfb_sem_semId",
          using: "BTREE",
          fields: [
            { name: "semesterId" },
          ]
        },
        {
          name: "sfb_bat_batId",
          using: "BTREE",
          fields: [
            { name: "batchId" },
          ]
        },
    ]
  });
};
