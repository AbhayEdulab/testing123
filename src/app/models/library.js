var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var LibrarySchema = new Schema({
    name: {type: String},
    link: {type: String},
    type : {type : String},
    subType: {type : String},
    subjects : {type :Array},
    batchId:{type: String,ref:'BatchMaster'},
    courseId:{type: String,ref:'CollegeCourse'},
    category:{type: String},
    createdOn : {type:Date,default:Date.now},
    updatedOn : {type:Date,default:Date.now},
});

module.exports = mongoose.model('Library', LibrarySchema);