const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('lecturejoinlinks', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    subjectId: {
      type:DataTypes.INTEGER ,
      allowNull: true,
      references: {
        model: 'subject',
        key: 'id'
      }
    },
    onlineLectureLink: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'lecturejoinlinks',
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
        name: "ljl_sub_subid",
        using: "BTREE",
        fields: [
          { name: "subjectId" },
        ]
      },
    ]
  });
};
