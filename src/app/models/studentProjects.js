var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var studentProjectSchema = new Schema({
    studentId: { type: String, ref: 'User' },
    projectTitle : {type: String},
    projectCat : {type:String},
    problemStatement: { type: String, } ,
    domain: { type: String, },
    description: { type: String, },
    startDate: { type: String, },
    endDate: { type: String, },
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
});
module.exports = mongoose.model('studentProjects', studentProjectSchema);