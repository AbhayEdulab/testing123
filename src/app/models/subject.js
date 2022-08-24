var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SubjectSchema = new Schema({
  semesterId:{type: String,ref:'semesterNew'},
  courseId :{type: String,ref:'CollegeCourse'},
 // batchId :{type: String,ref:'BatchMaster'},
  subject:{type: String,required: true },
  createdOn : {type:Date,default:Date.now},
  updatedOn : {type:Date,default:Date.now},

});

mongoose.model('Subject',SubjectSchema);