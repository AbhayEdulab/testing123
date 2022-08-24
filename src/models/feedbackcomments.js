const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('feedbackcomment', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    feedbackId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    feedbackcomments : {
        type: DataTypes.STRING(255),
        allowNull: true
      },
   
  }, {
    sequelize,
    tableName: 'feedbackcomment',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      }, {
          name: "fbc_use_useId",
          using: "BTREE",
          fields: [
            { name: "userId" },
          ]
        },
        {
          name: "fbc_fd_fdId",
          using: "BTREE",
          fields: [
            { name: "feedbackId" },
          ]
        },
    ]
  });
};
