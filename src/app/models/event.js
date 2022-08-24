var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var EventSchema = new Schema({
    user_id:{type:String,default:"",required:true},
  role:{type:String,default:"",required:true},
  title:{type:String,default:"",required:true},
 date:{type:String,default:"",required:true},
 courseId:{type:String,default:"",ref:'CollegeCourse'},
 batchId: {type: String, default:"", ref:'BatchMaster'},
 semesterId:{type: String, default:"", ref:'semesterNew'},
  //time_from:{type:String,default:"",required:true},
 // time_to: {type:String,default:"",required:true},
 // location : {type:String,default:"",required:true},
  description : {type:String,default:"",required:true},
  todoCheck:{type:String,default:"",required:true},
  createdOn : {type:Date,default:Date.now},
  updatedOn : {type:Date,default:Date.now}

});

mongoose.model('Event',EventSchema);