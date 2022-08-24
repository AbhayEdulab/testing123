var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var QuestionsSchema = new Schema({
  question: {type:String,required:true},
  user_id:{type:String,default:"",required:true},
  course_id : {type:String,required:true},
 // batch_id : {type:String,required:true},
  sem_id : {type:String,required:true},
  chapterName : {type:String,required:true},
  viewCount : {type:Number,default:"0"},
  createdOn : {type:Date,default:Date.now},
  updatedOn : {type:Date,default:Date.now}

});

mongoose.model('Questions',QuestionsSchema);