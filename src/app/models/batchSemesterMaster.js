var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BatchSemesterMasterSchema = new Schema({
  batchId:{type:String,ref:'BatchMaster'},
  semesterId:{type:String,ref:'semesterNew'},
  courseId :{type: String,ref:'CollegeCourse'},
  departmentId:{type: String,ref:'CollegeDepartment'},
  createdOn : {type:Date,default:Date.now},
  updatedOn : {type:Date,default:Date.now},

});

mongoose.model('BatchSemesterMaster',BatchSemesterMasterSchema);