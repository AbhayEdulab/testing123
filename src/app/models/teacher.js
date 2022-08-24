var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var TeacherSchema = new Schema({
  divisionId:{type: String, ref:'newDivision'},
  teacher_id :{type: String, ref: 'User'},
  course_id : {type: String, ref: 'CollegeCourse'},
  batch_id : {type: String, ref: 'BatchMaster'},
  department_id:{type: String, ref: 'CollegeDepartment'},
  subject:{type: String, required:true},
  semesterId:{type: String, ref: 'semesterNew'},
  createdOn : {type:Date,default:Date.now},
  updatedOn : {type:Date,default:Date.now},
  ratePerHour : {type:String, required:true},

});


mongoose.model('Teacher',TeacherSchema);