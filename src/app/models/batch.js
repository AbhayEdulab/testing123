var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BatchSchema = new Schema({
  batch_id : {type:String,default:"",required:true},
  teacher_id : {type:String,ref:'User'},
  course_id : {type:String,ref:'Course',required:true},
  // batchTimeStart :{type:String,default:"",required:true},
  // batchTimeEnd :{type:String,default:"",required:true},
  batchfromdate: {type: String},
  batchtodate: { type: String},
  createdOn : {type:Date,default:Date.now},
  updatedOn : {type:Date,default:Date.now}
});
  mongoose.model('Batch',BatchSchema);