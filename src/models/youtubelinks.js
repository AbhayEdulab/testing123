const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('youtubelinks', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    chapterId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'chapters',
        key: 'id'
      }
    },
    videoName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    typeOfUpload: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    youTubeLink: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'youtubelinks',
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
        name: "you_chp_chid",
        using: "BTREE",
        fields: [
          { name: "chapterId" },
        ]
      },
    ]
  });
};
