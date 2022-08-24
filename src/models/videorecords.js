const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('videorecords', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    lessonsId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'lecturejoinlinks',
        key: 'id'
      }
    },
    timeRecord: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    seconds: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    videoLink: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'videorecords',
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
        name: "vir_use_uid",
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
      {
        name: "vir_les_lid",
        using: "BTREE",
        fields: [
          { name: "lessonsId" },
        ]
      },
    ]
  });
};
