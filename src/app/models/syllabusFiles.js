var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SyllabusFilesSchema = new Schema({
doc_id:{type:String},
courseId : {type: String,ref:'CollegeCourse'},
subject:{type: String,required: true},
semesterId : {type: String,ref:'semesterNew'},
description:{type: String},
//percentage:{type:Number,default: '0'},
//totalFiles:{type:Number,default:'0'},
length : {type: Number},
name: { type: String },
type: { type: String },
//approval : {type:String, required : true}

 
});

mongoose.model('SyllabusFiles',SyllabusFilesSchema);