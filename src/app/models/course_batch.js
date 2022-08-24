var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CourseBatchSchema = new Schema({
  course_id :{type: String,ref:'CollegeCourse'},
  batch_id:{type: String,ref:'BatchMaster'},
  year:{type:String,required:true},
  createdOn : {type:Date,default:Date.now},
  updatedOn : {type:Date,default:Date.now},

});

mongoose.model('CourseBatch',CourseBatchSchema);