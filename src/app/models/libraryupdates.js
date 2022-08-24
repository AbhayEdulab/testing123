var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var LibraryUpdateSchema = new Schema({
   
    name: {
        type: String
    },
    updatetype: {
        type: String
    },
    description : {
        type: String
    },
    topiclibID : {
        type : String, ref: 'topicLibrary'
    },
    topicName : {
        type : String
    },
    createdOn : {type:Date,default:Date.now},
    updatedOn : {type:Date,default:Date.now},
});

module.exports = mongoose.model('LibraryUpdates', LibraryUpdateSchema);