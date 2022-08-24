var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var TimeTableSchema = new Schema({
  title:{type:String,default:"",required:true},
  date:{type:String,default:"",required:true},
  time_from:{type:String,default:"",required:true},
  time_to: {type:String,default:"",required:true},
  batch_id : {type:String,default:"",required:true},
  createdOn : {type:Date,default:Date.now},
  updatedOn : {type:Date,default:Date.now}

});

mongoose.model('TimeTable',TimeTableSchema);