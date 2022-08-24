var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var onlineLectureLinkSchema = new Schema({
  chapterId :{type: String,ref:'Chapter'},
  onlineLectureLink : {type:String},
  createdOn : {type:Date,default:Date.now},
  type_of_upload:{
    type: String
  },
  onlineLectureDate:{ type: String, required: false },
});

mongoose.model('OnlineLectureLink', onlineLectureLinkSchema);