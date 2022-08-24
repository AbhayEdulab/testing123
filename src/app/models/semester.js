var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SemesterSchema = new Schema({
  semesterName :{type:String,required:true},
  semester_start_date :{type: String,required:true},
  semester_end_date :{type: String,required:true},
  courseId :{type: String,ref:'CollegeCourse'},
  departmentId:{type: String,ref:'CollegeDepartment'},
  batchId:{type: String,ref:'BatchMaster'},
  semesterStatus:{type: String,default:"false",required:true},
  createdOn : {type:Date,default:Date.now},
  updatedOn : {type:Date,default:Date.now},

});

mongoose.model('Semester',SemesterSchema);