var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const STATUS=['active','inactive'];
var EnrollmentDetailsSchema = new Schema({
  user_id :{type: String, ref: 'User'},
  course_id : {type: String, ref: 'Course'},
  batch_id : {type: String, ref: 'Batch'},
  status : {type:String ,default:"inactive",enum:STATUS,required:true},
  createdOn : {type:Date,default:Date.now},
  updatedOn : {type:Date,default:Date.now}
  });
  mongoose.model('EnrollmentDetail',EnrollmentDetailsSchema);