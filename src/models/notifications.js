const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('notifications', {
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
    notificationData: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    readNotification: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    deleteNotification: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    urlData: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    queryParams: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    action: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'notifications',
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
        name: "ntf_use_uid",
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
    ]
  });
};
