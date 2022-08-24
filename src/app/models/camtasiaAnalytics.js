var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CamtasiaAnalyticsSchema = new Schema({
    userId: {type:String, ref: 'User'},
    chapter :  { type: String, ref: 'Chapter'},
    link : {type: String, default:""},
    percent: {type: Number},
    seconds: {type: Number},
    duration: {type: Number},
    linkName : {type: String, default:""},
    course : {type:String,ref:'CollegeCourse',required:true},
    semester: {type: String},
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
});

const CamtasianAnalytics = mongoose.model('CamtasiaAnalytics', CamtasiaAnalyticsSchema);
module.exports = CamtasianAnalytics;