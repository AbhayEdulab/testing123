var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var JobListSchema = new Schema({
    companyName: {type: String},
    jobTitle: {type: String},
    jobDescription : {type : String},
    packageRange: {type : String},
    websiteLink: {type:String},
    addedBy: {type:String},
    addedBy_Id : {type:String,ref: 'User'},
    createdOn : {type:Date,default:Date.now},
    updatedOn : {type:Date,default:Date.now},
});
module.exports = mongoose.model('JobList', JobListSchema);