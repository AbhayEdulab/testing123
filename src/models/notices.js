const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('notices', {
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
    noticeName: {
      type: DataTypes.CHAR(255),
      allowNull: true
    },
    category: {
      type: DataTypes.CHAR(255),
      allowNull: true
    },
    textNotice: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    type: {
      type: DataTypes.CHAR(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'notices',
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
        name: "not_cou_cid",
        using: "BTREE",
        fields: [
          { name: "courseId" },
        ]
      },
      {
        name: "not_bat_bid",
        using: "BTREE",
        fields: [
          { name: "batchId" },
        ]
      },
    ]
  });
};
