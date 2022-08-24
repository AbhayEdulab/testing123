var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var EmailTrackerSchema = new Schema({
  email : {type:String,default:"",required:true},
  subject : {type:String,default:"",required:true},
  x_msg_id : {type:String,default:"",required:true},
  sent_on :  {type:String,default:"",required:true},
  createdOn : {type:Date,default:Date.now},
  updatedOn : {type:Date,default:Date.now}
});
mongoose.model('EmailTracker',EmailTrackerSchema);
