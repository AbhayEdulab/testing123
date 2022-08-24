var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var studentFeedbackSchema = new Schema({
    questionId : {type: String},
    batchId:{type: String, ref: 'BatchMaster'},
    studentId:{ type: String, ref: 'User'}, //'User'
    teacherId: { type: String, ref: 'User'}, //'User'
    semesterId: { type: String, ref: 'Semester'}, //'Semester'
    subject:{type:String},
    feedback:{type:String},
    Comment : {type :String},
    Complete : {type :String},
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
});
module.exports = mongoose.model('studentFeedback', studentFeedbackSchema);