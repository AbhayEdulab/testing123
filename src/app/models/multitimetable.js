var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var multiTimeTableSchema = new Schema({
  course_id : {type: String, ref: 'CollegeCourse'},
  batch_id : {type: String, ref: 'BatchMaster'},
  division_id : {type: String, ref: 'Division'},
  semester_id:{type:String,ref: 'Semester'},
  semesterName:{type:String,default:"",required:true},
courseName:{type:String,default:"",required:true},
batchName :{type:String,default:"",required:true},
divisionName:{type:String,default:"",required:true},
subject:{type:String,default:"",required:true},
teacherName:{type:String,default:"",required:true},
date:{type:String,default:"",required:true},
time:{type:String,default:"",required:true},
location : {type:String,default:"",required:true},
timeTableId : {type: String, ref: 'NewTimeTable'},

});
  mongoose.model('MultiTimeTable',multiTimeTableSchema);