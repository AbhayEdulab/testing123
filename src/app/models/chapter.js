var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ChapterSchema = new Schema({
  unitName:{type: String},
  chapterName:{type:String,required:true},
  courseId :{type: String,ref:'CollegeCourse'},
  subject:{type: String,required: true},
  semesterId:{type: String,ref:'semesterNew'},
  lastUpdated    : { type: String, required: false },
  description    : { type: String, required: false },
  videoLink:{type:Array,required:false},
  icon        : { type: String, required: false,default:"file-text-outline"  },
  status: { type: String, required: true, default: 'Unapproved' },
  createdOn : {type:Date,default:Date.now},
  updatedOn : {type:Date,default:Date.now},
  completed  : {type:String,default:"false",required:true},
});

mongoose.model('Chapter',ChapterSchema );