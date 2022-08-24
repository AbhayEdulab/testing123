var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var onlinelectureattendence = new Schema({
fullName:{type:String,default:""},
isListeningOnly:{type:String,default:""},
hasJoinedVoice : {type:String,default:""},
hasVideo : {type:String,default:""},
role : {type:String,default:""},
timeTableId : {type: String, ref: 'NewTimeTable'},
subject : {type:String,default:""},
createdOn : {type:String,default:""},
createdTime : {type:Date,default:Date.now},
}); 
  mongoose.model('OnlineLectureAttendence',onlinelectureattendence);