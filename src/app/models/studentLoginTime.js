var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var StudentLoginTimeSchema = new Schema({
  user_id : {type:String, ref: 'User'},
  loginDate:{type:String,default:"",required:true},
  startTime:{type:String,default:"",required:true},
  endTime: {type:String,default:"",required:true},
  seconds: {type:Number},
  seconds_increment:{type:Array,default:0},
  courseId : {type:String,required:true},
  batchId : {type:String,required:true},
  studentStatus : {type:String},
  //minutes: {type:Number},
  //hours: {type:Number},
 // timeDuration:{type:String},
 // loginCount:{type:Number},
  createdOn : {type:Date,default:Date.now},
  updatedOn : {type:Date,default:Date.now}

});

mongoose.model('StudentLoginTime',StudentLoginTimeSchema);