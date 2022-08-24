var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var LibraryUploadSchema = new Schema({
    doc_id: {
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
    topiclibID : {
        type : String, ref: 'topicLibrary'
    },
    createdOn : {type:Date,default:Date.now},
    updatedOn : {type:Date,default:Date.now},
});

module.exports = mongoose.model('LibraryUploads', LibraryUploadSchema);