//Author SP : 23-07-2020
const mongoose = require('mongoose');
const teacherDetailsUploadsSchema = new mongoose.Schema({
    doc_id: {
        type: String
    },
    userId: {
        type: String,ref:'User'
    },
    docType:{
        type: String
    },
    additionalInfo:{
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

module.exports = mongoose.model('TeacherDetailsUpload', teacherDetailsUploadsSchema);