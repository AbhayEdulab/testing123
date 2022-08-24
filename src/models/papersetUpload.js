const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('papersetUpload', {
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
    batchId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'batchmasters',
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
        semesterId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'semesters',
            key: 'id'
          }
        },
        subjectId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'subject',
            key: 'id'
          }
        },
    filename: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    fileLength: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
   
    type: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'papersetupload',
    timestamps: false,
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
