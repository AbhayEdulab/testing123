var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var NewDivisionSchema = new Schema({
  name:{type:String,required:true},
  courseId:{type:String,ref:'CollegeCourse'},
  batchId:{type:String,ref: 'BatchMaster'},
  semesterId:{type:String,ref: 'semesterNew'},
  createdOn : {type:Date,default:Date.now},
  updatedOn : {type:Date,default:Date.now},

});

mongoose.model('newDivision',NewDivisionSchema,'newDivision');