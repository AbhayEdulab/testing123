var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var camtasiaLinksSchema = new Schema({
    course : {type:String,ref:'CollegeCourse',required:true},
    semester : { type: String, ref: 'semesterNew'},
    chapter :  { type: String, ref: 'Chapter'},
    subject : {type: String, default:""},
    linkName : {type: String, default:""},
    link : {type: String, default:""},
    createdOn : {type:Date,default:Date.now},

});


mongoose.model('CamtasiaLinks',camtasiaLinksSchema);