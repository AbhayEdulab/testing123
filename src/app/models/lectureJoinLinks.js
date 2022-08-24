var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var lectureJoinLinksSchema = new Schema({
  subject :{type: String},
  onlineLectureLink : {type:String},
  createdOn : {type:Date,default:Date.now},
});

mongoose.model('LectureJoinLinks', lectureJoinLinksSchema);