const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('systemfeedback', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    studentId: {
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
    hours : {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      percentage : {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      process : {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      clarity : {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      capability : {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      commentRecommendation : {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      comment : {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      recommendation : {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      suggestion : {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      suggest : {
        type: DataTypes.STRING(255),
        allowNull: true
      },
   
  }, {
    sequelize,
    tableName: 'systemfeedback',
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
