var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var NoticeSchema = new Schema({
    noticeName: {type: String,required:true},
    batchId:{type: String,ref:'BatchMaster'},
    courseId:{type: String,ref:'CollegeCourse'},
    category:{type: String},
    textNotice:{type:String,default:''},
    date : {type:String},
    type:{type:String},
    createdOn : {type:Date,default:Date.now},
    updatedOn : {type:Date,default:Date.now},
});

module.exports = mongoose.model('Notice', NoticeSchema);