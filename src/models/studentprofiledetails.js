const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('studentprofiledetails', {
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
    admissionCategory: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    mobileNumber: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    whatsappNumber: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    emailId: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    nationality: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    motherName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    motherContactNumber: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fatherName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    fatherContactNumber: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    homeAddress: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    state: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    country: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    guardianEmailId: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    guardianFullName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    guardianMobileNumber: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'studentprofiledetails',
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
        name: "spd-use-stid",
        using: "BTREE",
        fields: [
          { name: "studentId" },
        ]
      },
    ]
  });
};
