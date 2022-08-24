var mongoose = require('mongoose');

var NewCourseSchema = new mongoose.Schema({
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
  coursefromdate: {
    type: String,
    required: true
  },
  coursetodate: {
    type: String,
    required: true
  },
  overview: {
    type: String,
    required: false
  },
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
  teacher_select : {type:String,default:"false",required:true},
  //semesterStatus:{type: String,default:"false",required:true},
  approval : {type:String,
    required : true}
});

var NewCourse = mongoose.model('NewCourse', NewCourseSchema);

module.exports = NewCourse;