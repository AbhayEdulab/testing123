const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('semester', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    semesterName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    semesterStartDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    semesterEndDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    semesterStatus: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    semYear: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'semester',
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
