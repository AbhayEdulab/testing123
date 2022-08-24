var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var newtimetableSchema = new Schema({
  course_id: {
    type: String,
    ref: 'CollegeCourse'
  },
  batch_id: {
    type: String,
    ref: 'BatchMaster'
  },
  division_id: {
    type: String,
    ref: 'Division'
  },
  semester_id: {
    type: String,
    ref: 'Semester'
  },
  teacher_id: {
    type: String,
    default: "",
    required: true
  },
  semesterName: {
    type: String,
    default: "",
    required: true
  },
  courseName: {
    type: String,
    default: "",
    required: true
  },
  batchName: {
    type: String,
    default: "",
    required: true
  },
  divisionName: {
    type: String,
    default: "",
    required: true
  },
  subject: {
    type: String,
    default: "",
    required: true
  },
  teacherName: {
    type: String,
    default: "",
    required: true
  },
  date: {
    type: String,
    default: "",
    required: true
  },
  fromTime: {
    type: String,
    default: "",
    required: true
  },
  toTime: {
    type: String,
    default: "",
    required: true
  },
  location: {
    type: String,
    default: "",
    required: true
  },
  approval: {
    type: String,
    default: "",
    required: true
  },
  reason: {
    type: String,
    default: ""
  },
  playbackLink: {
    type: Array,
    "default": []
  },
  totalMinutes: {
    type: String,
    default: ""
  },
  cancelByRole: {
    type: String,
    default: ""
  },
  cancelByUser: {
    type: String,
    default: ""
  },
    createdOn : {type:Date,default:Date.now},
    updatedOn : {type:Date,default:Date.now},
});
mongoose.model('NewTimeTable', newtimetableSchema);