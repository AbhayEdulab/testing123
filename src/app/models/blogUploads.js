//Author SP : 20-01-2020
const mongoose = require('mongoose');
const blogUploadsSchema = new mongoose.Schema({
    doc_id: {
        type: String
    },
    blogId: {
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

module.exports = mongoose.model('BlogUploads', blogUploadsSchema);