const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('topiclibraries', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    refTopicId: {
      type: DataTypes.JSON,
      allowNull: true
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true
    },
    videos: {
      type: DataTypes.JSON,
      allowNull: true
    },
    files: {
      type: DataTypes.JSON,
      allowNull: true
    },
    topicName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    websites: {
      type: DataTypes.JSON,
      allowNull: true
    },
    podcasts: {
      type: DataTypes.JSON,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    category: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    setIMPTopic: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'topiclibraries',
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
