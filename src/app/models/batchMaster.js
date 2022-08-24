var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BatchMasterSchema = new Schema({
  batchName:{type:String,required:true},
  courseId :{type: String,ref:'CollegeCourse'},
  departmentId:{type: String,ref:'CollegeDepartment'},
  year:{type:String,required:true},
  batchStatus:{type: String,default:"false",required:true},
  createdOn : {type:Date,default:Date.now},
  updatedOn : {type:Date,default:Date.now},

});

mongoose.model('BatchMaster',BatchMasterSchema);