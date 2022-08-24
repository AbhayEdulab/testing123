var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bbbInfo = new Schema({
    moderatorUrl:{type:String,required:true},
    attendeeUrl :{type: String,required:true},
    meetingEndUrl:{type: String,required:true},
    meetingName:{type:String,required:true},
    TeacherName:{type:String},
    TeacherUserID:{type:String},
    studentId:{type:String},
    createdOn : {type:Date,default:Date.now},
    updatedOn : {type:Date,default:Date.now},

});

mongoose.model('bbbInfo',bbbInfo);