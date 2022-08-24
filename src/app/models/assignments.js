var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var assignmentsSchema = new Schema({
  courseId: {
    type: String,
    default: "",
    required: true,
    ref: 'CollegeCourse'
  },
  // courseName:
  //   {type:String,
  //     default:"",
  //     required:true},
  assignmentName: {
    type: String,
    default: "",
    required: true
  },
  Point: {
    type: Number,
    default: "",
    required: true
  },
  DueDate: {
    type: String,
    default: "",
    required: true
  },
  BatchId: {
    type: String,
    default: "",
    required: true,
    ref: 'BatchMaster'
  },
  // assignmentDescription:
  //   {type:String,
  //     default:"",
  //     required:true},
  typeOfAssignment: {
    type: String,
    default: "",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  subjects: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  divisionName: {
    type: String,
    required: true
  },
  groupId: {
    type: Schema.ObjectId,
  },
  fullName: {
    type: String,
  },
  name: {
    type: String
  },
  type: {
    type: String
  },
  fileLength: {
    type: Number
  },
  doc_id: {
    type: String
  },
  teacherName: {
    type: String
  },
  role: {
    type: String
  },
  teacherId: {
    type: String,
    required: true
  }
})
mongoose.model('Assignments', assignmentsSchema);