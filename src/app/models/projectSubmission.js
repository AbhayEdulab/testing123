const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ProjectSubmissionSchema = new Schema({
    doc_id: {
        type: String
    },
    submissionName:{
        type: String
    },
   courseId: {
        type: String,
        ref:'CollegeCourse'
    },
    batchId: {
      type: String,
      ref:'BatchMaster'
    },
    evaluatorId: {
        type: String,
       // ref:'User'
    },
    evaluatorName: {
        type: String,
       // ref:'User'
    },
    role: {
        type: String,
        //ref:'User'
    },
    Point:
    {type:Number,
     default:"",
    required:true},
    groupId:{
        type:Schema.ObjectId,
      },
    length : {
        type: Number
    },
    name: {
        type: String
    },
    type: {
        type: String
    },
    createdAt:
   {type:Date,
    default:Date.now}
});

mongoose.model('ProjectSubmission', ProjectSubmissionSchema);