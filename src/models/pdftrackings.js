const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pdftrackings', {
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
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'courses',
        key: 'id'
      }
    },
    chapterId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'chapters',
        key: 'id'
      }
    },
    filename: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    pageCount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    totalPages: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    percentage: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'pdftrackings',
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
        name: "pft_use_uid",
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
      {
        name: "pft_cou_cid",
        using: "BTREE",
        fields: [
          { name: "courseId" },
        ]
      },
      {
        name: "pft_chap_chid",
        using: "BTREE",
        fields: [
          { name: "chapterId" },
        ]
      },
    ]
  });
};
