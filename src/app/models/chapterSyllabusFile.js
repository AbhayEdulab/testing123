var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChapterSyllabusFilesSchema = new Schema({
userId:{type: String,ref:'User'},
unitName:{type:String,ref:'Chapter'},
chapterName:{type:String,ref:'Chapter'},
doc_id:{type:String},
courseId : {type: String,ref:'CollegeCourse'},
subject:{type: String,required: true},
semesterId : {type: String,ref:'semesterNew'},
description:{type: String},
length : {type: Number},
name: { type: String },
type: { type: String },

 
});

mongoose.model('ChapterSyllabusFiles',ChapterSyllabusFilesSchema);