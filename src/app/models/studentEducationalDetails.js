var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var StudentEducationalDetailsSchema = new Schema({
  studentId:{type:String,required:true},
  stream :{type: String,required:true},
  exam1:{type: String,required:true},
  year1:{type:String,required:true},
  board_university1:{type: String,required:true},
  percentage1 : {type:String,required: true},
  exam2: {type: String,required:true},
  year2: {type: String,required:true},
  board_university2: {type: String,required:true},
  percentage2: {type: String,required:true},
  exam3: {type: String,required:true},
  year3: {type: String,required:true},
  board_university3: {type: String,required:true},
  percentage3: {type: String,required:true},
  exam4: {type: String,required:false},
  year4: {type: String,required:false},
  board_university4:{type: String,required:false},
  percentage4:{type: String,required:false},
  exam5:{type: String,required:false},
  year5:{type: String,required:false},
  board_university5:{type: String,required:false},
  percentage5:{type: String,required:false},
  updatedOn : {type:Date,default:Date.now},

});

mongoose.model('StudentEducationalDetails',StudentEducationalDetailsSchema);