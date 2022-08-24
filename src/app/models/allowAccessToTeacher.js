var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AllowAccessToTeacherSchema = new Schema({
  teacher_id:{type:String,required:true},
  ppt_notes :{type: String,default:"false"},
  practise_question :{type: String,default:"false"},
  prerequisite:{type: String,default:"false"},
  onlineLecture:{type: String,default:"false"},
  quiz:{type: String,default:"false"},
  syllabus_objectives:{type: String,default:"true"},
  vimeoLink:{type: String,default:"false"},
  createdOn : {type:Date,default:Date.now},
  updatedOn : {type:Date,default:Date.now},

});

mongoose.model('AllowAccessToTeacher',AllowAccessToTeacherSchema);