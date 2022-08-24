var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var YouTubeTrackingSchema = new Schema({
  user_id :{type: String, ref: 'User'},
  totalTime : {type:Number},
  watchTime:{type:Number},
  percentage:{type:Number},
  course_id : {type: String, ref: 'Course'},
  chapterId : {type: String, ref: 'Chapter'},
  youtubeId : {type: String, ref: 'YouTubeLink'},
  createdOn : {type:Date,default:Date.now},
  updatedOn : {type:Date,default:Date.now},
});

mongoose.model('YouTubeTracking',YouTubeTrackingSchema);