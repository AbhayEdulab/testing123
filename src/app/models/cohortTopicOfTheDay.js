var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cohortTopicOfTheDaySchema = new Schema({
date:{type:String,default:"",required:true},
subject:{type:String,default:"",required:true},
topicNames:{type:String,default:"",required:true},
cohortTimeTableId : {type: String, ref: 'CohortTimeTable'},
});
  mongoose.model('CohortTopicOfTheDay',cohortTopicOfTheDaySchema);