var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var studentEducationCertificatesSchema = new Schema({
    studentId: { type: String,ref: 'User'},
    doc_id: { type: String },
    file_type: { type: String },
    document_name: { type: String },
    document_category: { type: String },
    curriculumName: { type: String },
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
});
module.exports = mongoose.model('studentEducationCertificates', studentEducationCertificatesSchema);