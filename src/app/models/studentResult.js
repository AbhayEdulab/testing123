var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var StudentResultSchema = new Schema({
  userId :{type: String, ref: 'User'},
  courseId : {type: String, ref: 'CollegeCourse'},
  batchId : {type: String, ref: 'BatchMaster'},
  semesterId : {type: String, ref: 'semesterNew'},
  fileName: {type:String},
  profile: {type: JSON},
  subjects: {type: JSON},
  semesters: {type: JSON},
  createdOn : {type:Date,default:Date.now},
  updatedOn : {type:Date,default:Date.now},
});


mongoose.model('StudentResult',StudentResultSchema);