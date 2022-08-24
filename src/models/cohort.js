const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cohort', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    batchesId: {
      type: DataTypes.JSON,
      allowNull: true
    },
    cohortName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    batchesArr: {
      type: DataTypes.JSON,
      allowNull: true
    },
    batchesArrView: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'cohort',
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
    ]
  });
};
