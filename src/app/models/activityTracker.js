var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ActivityTrackerSchema = new Schema({
  activity : {type:String,required:true},
  data : {type: String,required: true},
  courseId :{type: String, required: false},
  batchId : { type: String, required: false },
  createdOn : {type:Date,default:Date.now},
  updatedOn : {type:Date,default:Date.now},
});

mongoose.model('ActivityTracker',ActivityTrackerSchema );