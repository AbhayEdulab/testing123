var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var systemFeedbackSchema = new Schema({
    batchId:{type: String, ref: 'BatchMaster'},
    studentId:{ type: String, ref: 'User'}, //'User'
    semesterId: { type: String, ref: 'Semester'}, //'Semester'
    hours: {type:String},
    percentage:{type:String},
    process:{type:String},
    clarity: {type:String},
    capability:{type:String},
    commentRecommendation: {type:String},
    comment:{type:String},
    recommendation:{type:String},
    suggestion:{type:String},
    suggest:{type:String},
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
});
module.exports = mongoose.model('systemFeedback', systemFeedbackSchema);