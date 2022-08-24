var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var cohortTimeTableSchema = new Schema({
  cohort_id : {type: String, ref: 'Cohort'},
  semester_id:{type:String,ref: 'Semester'},
  teacher_id :{type:String,default:"",required:true},
  semesterName:{type:String,default:"",required:true},
  cohortName:{type:String,default:"",required:true},
  subject:{type:String,default:"",required:true},
  teacherName:{type:String,default:"",required:true},
  date:{type:String,default:"",required:true},
  fromTime:{type:String,default:"",required:true},
  toTime:{type:String,default:"",required:true},
  location : {type:String,default:"",required:true},
  approval : {type:String,default:"",required:true},
  playbackLink : {type:String,default:""},
  cohortTeacherId : {type: String, ref: 'CohortTeacher'},
});
  mongoose.model('CohortTimeTable',cohortTimeTableSchema);