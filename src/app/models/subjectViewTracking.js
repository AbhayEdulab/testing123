var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SubjectViewTrackingSchema = new Schema({
courseId : {type: String,ref:'CollegeCourse'},
subject:{type: String,required: true},
semesterId : {type: String,ref:'semesterNew'},
subjectViewCount : {type:Number},
percentage:{type:Number,default: '0'},
totalFiles:{type:Number,default:'0'}

 
});

mongoose.model('SubjectViewTracking',SubjectViewTrackingSchema);