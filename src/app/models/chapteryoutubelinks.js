//Author SP : 21-02-2020 // Ramdas
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var youTubeLinkSchema = new Schema({
  chapterId :{type: String,ref:'Chapter'},
  youTubeLink : {type:String},
  videoName : {type:String},
  createdOn : {type:Date,default:Date.now},
  type_of_upload:{
    type: String
  },
});

mongoose.model('YouTubeLink', youTubeLinkSchema);