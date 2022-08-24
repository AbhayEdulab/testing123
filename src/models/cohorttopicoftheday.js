const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cohorttopicoftheday', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    cohortTimeTableId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'cohorttimetable',
        key: 'id'
      }
    },
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    topicNames: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'cohorttopicoftheday',
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
        name: "ctt_cht_ctid",
        using: "BTREE",
        fields: [
          { name: "cohortTimeTableId" },
        ]
      },
    ]
  });
};
