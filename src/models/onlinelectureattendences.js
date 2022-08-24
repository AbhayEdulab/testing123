const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('onlinelectureattendences', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    timeTableId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'newtimetables',
        key: 'id'
      }
    },
    fullName: {
      type: DataTypes.CHAR(255),
      allowNull: true
    },
    isListeningOnly: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    
    hasJoinedVoice: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    hasVideo: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    role: {
      type: DataTypes.CHAR(255),
      allowNull: true
    },
    subjectId: {
      type:DataTypes.INTEGER ,
      allowNull: true,
      references: {
        model: 'subject',
        key: 'id'
      }
    },
  }, {
    sequelize,
    tableName: 'onlinelectureattendences',
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
        name: "ola_tta_ttid",
        using: "BTREE",
        fields: [
          { name: "timeTableId" },
        ]
      },
      {
        name: "ola_sub_subid",
        using: "BTREE",
        fields: [
          { name: "subjectId" },
        ]
      },
    ]
  });
};
