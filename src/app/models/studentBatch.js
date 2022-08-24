
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var StudentBatchSchema = new Schema({
  batchId :{type: String, ref: 'BatchMaster'},
  departmentId :{type: String, ref: 'CollegeDepartment'},
  courseId:{type:String,ref:'CollegeCourse'},
  studentId:{type: String, ref: 'User'},
  batch_start_date :{type: String},
  batch_end_date :{type: String},
  divisionId:{type: String, ref: 'newDivision'},
  //yearId:{type:String,ref:'CourseBatch'},
  //courseName :{type: String,required:true},
  //shortCourseName:{type: String,required:true},
  //subjects : {type: String,required: true},
  //departmentName:{type: String,required: true},
  //batchName:{type: String,required: true},
  createdOn : {type:Date,default:Date.now},
  updatedOn : {type:Date,default:Date.now},

});

mongoose.model('StudentBatch',StudentBatchSchema);