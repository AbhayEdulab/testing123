//Author SP : 20-01-2020
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SubjectReferenceSchema = new Schema({
  subject:{type:String},
  courseId :{type: String,ref:'CollegeCourse'},
  semesterId:{type:String,ref:'semesterNew'},
  description : {type:String},
  link:{type:String,default:""},
  createdOn : {type:Date,default:Date.now},
  updatedOn : {type:Date,default:Date.now},

});

mongoose.model('SubjectReference',SubjectReferenceSchema);