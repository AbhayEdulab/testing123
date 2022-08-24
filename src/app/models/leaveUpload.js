var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var LeaveUploadSchema = new Schema({
    doc_id: {
        type: String
    },
   leaveId: {
        type: String
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
    createdOn : {type:Date,default:Date.now},
    updatedOn : {type:Date,default:Date.now},
});

module.exports = mongoose.model('LeaveUpload', LeaveUploadSchema);