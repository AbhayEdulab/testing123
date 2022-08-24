const mongoose = require('mongoose');
const webinarUploadsSchema = new mongoose.Schema({
    doc_id: {
        type: String
    },
    webinarId: {
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

module.exports = mongoose.model('WebinarUploads', webinarUploadsSchema);