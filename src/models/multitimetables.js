const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('multitimetables', {
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
    batchId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'batchmasters',
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
    divisionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'division',
        key: 'id'
      }
    },
    timeTableId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'newtimetables',
        key: 'id'
      }
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    time: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'multitimetables',
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
        name: "mtt_cou_cid",
        using: "BTREE",
        fields: [
          { name: "courseId" },
        ]
      },
      {
        name: "mtt_bat_bid",
        using: "BTREE",
        fields: [
          { name: "batchId" },
        ]
      },
      {
        name: "mtt_sem_sid",
        using: "BTREE",
        fields: [
          { name: "semesterId" },
        ]
      },
      {
        name: "mtt_div_did",
        using: "BTREE",
        fields: [
          { name: "divisionId" },
        ]
      },
      {
        name: "mtt_ntt_ttid",
        using: "BTREE",
        fields: [
          { name: "timeTableId" },
        ]
      },
    ]
  });
};
