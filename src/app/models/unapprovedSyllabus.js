var mongoose = require('mongoose');

var UnapprovedSyllabusSchema = new mongoose.Schema({
  departmentId:{
    type: String,
    ref:'CollegeDepartment'
  },
  courseId: {
    type: String,
    ref:'CollegeCourse'
  },
  subjects: {
    type: String,
    required: true
  },
  semesterId:{
    type: String,
    ref: 'semesterNew'
  },
  syllabusFilesId:{
    type: String,
    ref:'SyllabusFiles',
    required:true
  },
  // coursefromdate: {
  //   type: String,
  //   required: true
  // },
  // coursetodate: {
  //   type: String,
  //   required: true
  // },
  // overview: {
  //   type: String,
  //   required: false
  // },
  description: {
    type: String,
    required: false
  },
  teacher_id: {
    type: String,
    ref:'User'
    // default: "",
    // required: true
  },
  createdOn: {
    type: Date,
    default: Date.now
  },
  updatedOn: {
    type: Date,
    default: Date.now
  },
  //semesterStatus:{type: String,default:"false",required:true},
  approval : {type:String,
    required : true}
});

var UnapprovedSyllabus = mongoose.model('UnapprovedSyllabus', UnapprovedSyllabusSchema);

module.exports = UnapprovedSyllabus;