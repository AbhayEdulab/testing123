const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    doc_id: {
        type: String
    },
   lessonId: {
        type: String , ref : 'Chapter'
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
    type_of_upload:{
        type: String
    }
});

module.exports = mongoose.model('Uploads', fileSchema);