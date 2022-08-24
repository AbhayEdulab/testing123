const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  var studentbatches =  sequelize.define('studentbatches', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    batchId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'batchmasters',
        key: 'id'
      }
    },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'departments',
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
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    divisionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'division',
        key: 'id'
      }
    },
    batchStartDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    batchEndDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'studentbatches',
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
        name: "stb_bam_bid",
        using: "BTREE",
        fields: [
          { name: "batchId" },
        ]
      },
      {
        name: "stb_cour_cid",
        using: "BTREE",
        fields: [
          { name: "courseId" },
        ]
      },
      {
        name: "stb_dep_depid",
        using: "BTREE",
        fields: [
          { name: "departmentId" },
        ]
      },
      {
        name: "stb_div_did",
        using: "BTREE",
        fields: [
          { name: "divisionId" },
        ]
      },
      {
        name: "stb_use_stid",
        using: "BTREE",
        fields: [
          { name: "studentId" },
        ]
      },
    ]
  });
  studentbatches.student= function(courseId,semesterId){
    var query ="select sb.studentId , u.fullName  from semesters as sem JOIN batchsemester as batsem  ON batsem.semesterId = sem.id JOin studentbatches as sb ON sb.batchId = batsem.batchId JOIN users as u ON sb.studentId = u.id where sem.courseId = "+courseId+" and sem.id = "+semesterId
    return sequelize.query(query,{type : sequelize.QueryTypes.SELECT});
  }
  studentbatches.getStudent=function(batchId){
    var query ="SELECT sb.* , u.fullName,co.courseName ,bat.batchName FROM studentbatches as sb JOIN users as u ON sb.studentId = u.id JOIN batchmasters as bat ON sb.batchId = bat.id JOIN courses as co On co.id = sb.courseId where  sb.batchId ="+batchId;
    return sequelize.query(query,{type : sequelize.QueryTypes.SELECT});  
  }
  studentbatches.studentEnrolledCourse =function(userId,semesterId){
    var query ="SELECT sb.*,c.courseName , bs.semesterId ,sem.semesterName ,bm.batchName , bm.batchStatus, bm.year , s.subject ,s.id as sibId  FROM studentbatches AS sb JOIN batchsemester as bs ON sb.batchId = bs.batchId  JOIN batchmasters as bm ON sb.batchId = bm.id JOIN subject as s ON s.semesterId = bs.semesterId  join semesters as sem ON sem.id  = bs.semesterId  join courses as c ON c.id = sb.courseId where studentId = "+userId+"   and bs.semesterId ="+semesterId+" GROUP BY s.subject";
    return sequelize.query(query,{type : sequelize.QueryTypes.SELECT});
  }
  studentbatches.studentEnrolledCourse1 =function(userId){
    var query ="SELECT sb.*,c.courseName, bs.semesterId ,sem.semesterName ,bm.batchName , bm.batchStatus, bm.year , s.subject ,s.id as sibId  FROM studentbatches AS sb JOIN batchsemester as bs ON sb.batchId = bs.batchId  JOIN batchmasters as bm ON sb.batchId = bm.id JOIN subject as s ON s.semesterId = bs.semesterId  join semesters as sem ON sem.id  = bs.semesterId  join courses as c ON c.id = sb.courseId where studentId = "+userId+"  GROUP BY s.subject";
    return sequelize.query(query,{type : sequelize.QueryTypes.SELECT});
  }
  studentbatches.getstudentbatch = function(batchId,divId){
    var query ="SELECT sb.*,u.fullName,u.email,u.id as userId FROM studentbatches as sb join users as u ON sb.studentId = u.id where sb.batchId = "+batchId+" and sb.divisionId = "+divId;
    return sequelize.query(query,{type : sequelize.QueryTypes.SELECT});
  }
  studentbatches.getBatchStudents = function(batchId,courseId){
    var query ="SELECT sb.studentId , sb.divisionId FROM studentbatches as sb JOIN users as u ON sb.studentId = u.id where sb.courseId = "+courseId+" and sb.batchId = "+batchId;
    return sequelize.query(query,{type : sequelize.QueryTypes.SELECT});
  }
  studentbatches.getStudentsByCourse =function(courseId){
    var query ="SELECT sb.* , u.fullName, u.email  FROM studentbatches as sb JOIN users as u ON sb.studentId = u.id where sb.courseId = "+courseId;
    return sequelize.query(query,{type : sequelize.QueryTypes.SELECT});
  }
  studentbatches.getstudentBatchforLeave = function(userId){
    var query ="SELECT * FROM `studentbatches` as sb Join batchmasters as bm on sb.batchId = bm.id where sb.studentId = "+userId;
    return sequelize.query(query,{type : sequelize.QueryTypes.SELECT});
  }
  return studentbatches;
};
