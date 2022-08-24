var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mcqSchema = new Schema({
 chapterId :{type:String,ref:'Chapter'},
  name : {type:String,required:true},
  set : [{question : {type:String,default:"",required:true},
          options : {type : [String], required:true},
          answer : {type:String,default:"",required:true}
        }],
  createdOn : {type:Date,default:Date.now},
  updatedOn : {type:Date,default:Date.now},
})

module.exports = mongoose.model('MCQ',mcqSchema);