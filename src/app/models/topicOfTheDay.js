var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var topicOfTheDaySchema = new Schema({
date:{type:String,default:"",required:true},
subject:{type:String,default:"",required:true},
topicNames:{type:String,default:"",required:true},
course_id : {type:String,default:"",required:true},
timeTableId : {type: String, ref: 'NewTimeTable'},
});
  mongoose.model('TopicOfTheDay',topicOfTheDaySchema);