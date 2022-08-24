const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vimeolink', {
    id: {
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
    vimeoLinkName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    vimeoLink: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    createdOn: {
      type: DataTypes.DATE(6),
      allowNull: true
    },
    type_of_upload: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    uploaded_at: {
      type: DataTypes.DATE(6),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'vimeolink',
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
        name: "vimo_chap_chid",
        using: "BTREE",
        fields: [
          { name: "chapterId" },
        ]
      },
    ]
  });
};
