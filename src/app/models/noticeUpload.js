var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var NoticeUploadSchema = new Schema({
    doc_id: {
        type: String
    },
   noticeId: {
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

module.exports = mongoose.model('NoticeUpload', NoticeUploadSchema);