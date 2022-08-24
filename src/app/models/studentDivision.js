var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var StudentDivisionSchema = new Schema({
  divisionId:{type:String,ref: 'Division'},
  batchId :{type: String, ref: 'BatchMaster'},
  departmentId :{type: String, ref: 'CollegeDepartment'},
  courseId:{type:String,ref:'CollegeCourse'},
  studentId:{type: String, ref: 'User'},
//   batch_start_date :{type: String,required:true},
//   batch_end_date :{type: String,required:true},
  //courseName :{type: String,required:true},
  //shortCourseName:{type: String,required:true},
  //subjects : {type: String,required: true},
  //departmentName:{type: String,required: true},
  //batchName:{type: String,required: true},
  createdOn : {type:Date,default:Date.now},
  updatedOn : {type:Date,default:Date.now},

});

mongoose.model('StudentDivision',StudentDivisionSchema );