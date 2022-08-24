var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CollegeCourseSchema = new Schema({
  courseName :{type: String,required: true},
  departmentId:{type: String,ref:'CollegeDepartment'},
  degree:{type:String,required: true},
  createdOn : {type:Date,default:Date.now},
  updatedOn : {type:Date,default:Date.now},

});

mongoose.model('CollegeCourse',CollegeCourseSchema);