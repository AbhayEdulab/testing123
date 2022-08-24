var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CohortTeacherSchema = new Schema({
  //cohort id is ref from cohort table
  cohortId:{type: String, ref:'Cohort'},
  teacher_id :{type: String, ref: 'User'},
  subject:{type: String, required:true},
  semesterId:{type: String, ref: 'semesterNew'},
  createdOn : {type:Date,default:Date.now},
  updatedOn : {type:Date,default:Date.now},

});


mongoose.model('CohortTeacher',CohortTeacherSchema);