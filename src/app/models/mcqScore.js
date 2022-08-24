var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mcqScoreSchema = new Schema({
  score :{type: String,default:"",required:true},
  outOf :{type:String,default:"",required:true},
  user_id :{type:String,ref:"User"},
  mcq_id :{type:String,ref:"MCQ"},
  createdOn : {type:Date,default:Date.now},
  updatedOn : {type:Date,default:Date.now},
})

module.exports = mongoose.model('MCQScore',mcqScoreSchema);