const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'courses',
        key: 'id'
      }
    },
    studentId: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    role: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    fullName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    firstName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    login: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    loginCount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    age: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    salt: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    address: {
      type: DataTypes.JSON,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    degreeName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    onBoarding: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    departmentName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    courseName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    academicYear: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    theme: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    aadhar: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    alteMail: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    altMobile: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    bankDetails: {
      type: DataTypes.JSON,
      allowNull: true
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    experience: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    jobDescreption: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    calendarOnOff: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    imageName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    linkedInLink: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    mobile: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    panId: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    lastLoginDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    lastLoginTime: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'users',
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
        name: "use_cou_cid",
        using: "BTREE",
        fields: [
          { name: "courseId" },
        ]
      },
      {
        name: "use_use_sid",
        using: "BTREE",
        fields: [
          { name: "studentId" },
        ]
      },
    ]
  });
};
