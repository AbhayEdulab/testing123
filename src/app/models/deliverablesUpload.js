const mongoose = require('mongoose');
const deliverablesUploadSchema = new mongoose.Schema({
    doc_id: {
        type: String
    },
    deliverables_id: {
        type: String, ref: 'Deliverables'
    },
    length : {
        type: Number
    },
    filename: {
        type: String
    },
    teacher_id: {type: String, ref: 'User'},
    type: {
        type: String
    }
});

module.exports = mongoose.model('DeliverablesUpload', deliverablesUploadSchema);