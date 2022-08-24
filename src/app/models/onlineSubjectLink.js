var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var OnlineSubjectLinkSchema = new Schema({
    onlineLinkName: {type: String,required:true},
    courseId:{type: String,ref:'CollegeCourse'},
    semesterId:{type:String,ref:'semesterNew'},
    subject:{type: String, required:true},
    createdOn : {type:Date,default:Date.now},
    updatedOn : {type:Date,default:Date.now},
});

module.exports = mongoose.model('OnlineSubjectLink', OnlineSubjectLinkSchema);