//Author SP : 20-01-2020
const mongoose = require('mongoose');
const ReferenceFilesSchema = new mongoose.Schema({
    doc_id: {
        type: String
    },
   subjectId: {
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
    }
});

module.exports = mongoose.model('ReferenceFiles', ReferenceFilesSchema);