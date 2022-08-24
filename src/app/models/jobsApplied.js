var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var jobsAppliedSchema = new Schema({
    studentId: { type: String, ref: 'User'},
    jobId : {type : String , ref : 'JobList'},
    status : {type : String},
    appliedOn : {type : String},
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
});
module.exports = mongoose.model('jobsApplied', jobsAppliedSchema);