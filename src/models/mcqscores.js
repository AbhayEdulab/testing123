const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mcqscores', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    mcqId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'mcqs',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    outOf: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'mcqscores',
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
        name: "mcs_mcq_mid",
        using: "BTREE",
        fields: [
          { name: "mcqId" },
        ]
      },
      {
        name: "mcs_use_uid",
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
    ]
  });
};
