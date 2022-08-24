var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var QuestionAnswerSchema = new Schema({
  answer: {type:String,required:true},
  user_id:{type:String,required:true},
  question_id : {type:String,required:true},
  path:  { type: String },
  createdOn : {type:Date,default:Date.now},
  updatedOn : {type:Date,default:Date.now},
  doc_id: {type: String},
  length : {type: Number},
  name: {type: String},
  type: {type: String}
});

mongoose.model('QuestionAnswer',QuestionAnswerSchema);