var mongoose = require('mongoose');

var CourseSchema = new mongoose.Schema({
  degreeName:{
    type: String,
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  subjects: {
    type: String,
    required: true
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
    default: "",
    required: true
  },
  teacher_name: {
    type: String,
    default: "",
    required: true
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
});

var Course = mongoose.model('Course', CourseSchema);

module.exports = Course;