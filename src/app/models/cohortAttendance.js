var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CohortAttendanceSchema = new Schema({
  user_id :{type: String, ref: 'User'},
  course_id : {type: String, ref: 'CollegeCourse'},
  batch_id : {type: String, ref: 'BatchMaster'},
  cohortTimeTableId : {type: String, ref: 'CohortTimeTable'},
  subject : {type:String,required: true},
  present: {type:String,default:"0",required:true},
  // virtualPresent: {type:String,default:"0",required:true},
  createdOn : {type:Date,default:Date.now},
  updatedOn : {type:Date,default:Date.now},
  attendance_date:{type:String,required: true},

});
mongoose.model('CohortAttendance',CohortAttendanceSchema);