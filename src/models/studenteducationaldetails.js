const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('studenteducationaldetails', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    stream: {
      type: DataTypes.CHAR(255),
      allowNull: true
    },
    exam1: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    year1: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    boardUniversity1: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    percentage1: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    exam2: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    year2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    boardUniversity2: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    percentage2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    exam3: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    year3: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    boardUniversity3: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    percentage3: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    exam4: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    year4: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    boardUniversity4: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    percentage4: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    exam5: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    year5: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    boardUniversity5: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    percentage5: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'studenteducationaldetails',
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
        name: "sed_use_stid",
        using: "BTREE",
        fields: [
          { name: "studentId" },
        ]
      },
    ]
  });
};
