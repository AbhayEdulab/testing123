var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var studentExpSchema = new Schema({
    studentId: { type: String, ref: 'User'},
    companyName : {type : String},
    jobTitle : {type : String},
    location : {type : String},
    position : {type : String},
    jobFunction : {type : String},
    description : {type : String},
    startDate : {type : String},
    endDate : {type : String},

    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
});
module.exports = mongoose.model('studentExp', studentExpSchema);