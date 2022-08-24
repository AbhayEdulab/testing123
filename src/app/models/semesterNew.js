var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SemesterNewSchema = new Schema({
  courseId:{type:String,required:true,ref:'CollegeCourse'},
  semesterName:{type:String,required:true},
  semester_start_date :{type: String,required:true},
  semester_end_date :{type: String,required:true},
  semesterStatus:{type: String,default:"false",required:true},
  semYear : {type: String,required:true},
  createdOn : {type:Date,default:Date.now},
  updatedOn : {type:Date,default:Date.now},

});

mongoose.model('semesterNew',SemesterNewSchema ,'semesterNew');